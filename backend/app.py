# Path: /backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
# ✅ เปลี่ยนจาก torch เป็น onnxruntime
import onnxruntime as ort
import cv2
import numpy as np
from pyzbar import pyzbar 
from collections import defaultdict
import math
import io
from PIL import Image
import base64

app = Flask(__name__)
CORS(app)  # เปิดใช้ CORS สำหรับ frontend

# ✅ โหลดโมเดล ONNX แทน PyTorch
try:
    # Setup ONNX Runtime providers (GPU first, then CPU fallback)
    providers = ['CUDAExecutionProvider', 'CPUExecutionProvider']
    session = ort.InferenceSession('model.onnx', providers=providers)
    
    # Get model input details
    input_name = session.get_inputs()[0].name
    input_shape = session.get_inputs()[0].shape
    
    print(f"✅ โหลดโมเดล ONNX สำเร็จ")
    print(f"📊 Input: {input_name}, Shape: {input_shape}")
    print(f"🔧 Providers: {session.get_providers()}")
    
except Exception as e:
    print(f"⚠️ ไม่สามารถโหลดโมเดล ONNX ได้: {e}")
    session = None

# ✅ เพิ่มฟังก์ชันสำหรับ ONNX preprocessing และ postprocessing
def preprocess_frame(frame):
    """
    เตรียม input สำหรับ ONNX model
    """
    # Resize เป็น 640x640 (YOLO input size)
    img = cv2.resize(frame, (640, 640))
    
    # แปลงจาก BGR เป็น RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Normalize เป็น 0-1
    img = img.astype(np.float32) / 255.0
    
    # เปลี่ยน format จาก HWC เป็น CHW และเพิ่ม batch dimension
    img = img.transpose(2, 0, 1)  # HWC -> CHW
    img = np.expand_dims(img, axis=0)  # เพิ่ม batch dimension
    
    return img

def postprocess_outputs(outputs, original_shape, conf_threshold=0.5, nms_threshold=0.4):
    """
    แปลง ONNX outputs กลับเป็น detection format
    """
    detections = outputs[0]  # Shape: (1, 25200, 85) for YOLO
    
    # Get original dimensions
    orig_h, orig_w = original_shape[:2]
    
    # Scale factors
    scale_x = orig_w / 640
    scale_y = orig_h / 640
    
    detection_results = []
    
    # Process detections
    for detection in detections[0]:  # Remove batch dimension
        # YOLO format: [x_center, y_center, width, height, confidence, class_scores...]
        confidence = detection[4]
        
        if confidence > conf_threshold:
            # Get bounding box
            x_center, y_center, width, height = detection[:4]
            
            # Convert to corner coordinates
            x1 = int((x_center - width/2) * scale_x)
            y1 = int((y_center - height/2) * scale_y)
            x2 = int((x_center + width/2) * scale_x)
            y2 = int((y_center + height/2) * scale_y)
            
            # Ensure coordinates are within image bounds
            x1 = max(0, min(x1, orig_w))
            y1 = max(0, min(y1, orig_h))
            x2 = max(0, min(x2, orig_w))
            y2 = max(0, min(y2, orig_h))
            
            # Get class with highest score
            class_scores = detection[5:]
            class_id = np.argmax(class_scores)
            
            detection_result = {
                'xmin': x1,
                'ymin': y1,
                'xmax': x2,
                'ymax': y2,
                'class': int(class_id),
                'confidence': float(confidence)
            }
            detection_results.append(detection_result)
    
    return detection_results

# ✅ ส่วนที่เหลือใช้เหมือนเดิม (ไม่ต้องแก้) - Advanced Barcode Detection Functions

def detect_line_segments(image):
    """
    Detect line segments using LSD algorithm (Stage 1.2 from paper)
    """
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()
    
    lsd = cv2.createLineSegmentDetector()
    lines = lsd.detect(gray)[0]
    
    if lines is not None:
        lines = lines.reshape(-1, 4)
    
    return lines

def calculate_line_angles_and_lengths(lines):
    """
    Calculate angles and lengths of line segments
    """
    if lines is None or len(lines) == 0:
        return [], []
    
    angles = []
    lengths = []
    
    for line in lines:
        x1, y1, x2, y2 = line
        
        length = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        lengths.append(length)
        
        angle = math.atan2(y2 - y1, x2 - x1) * 180 / math.pi
        if angle < 0:
            angle += 180
        angles.append(angle)
    
    return angles, lengths

def predict_rotation_angle(angles, lengths, angle_tolerance=5):
    """
    Predict rotation angle by clustering line angles
    """
    if not angles or not lengths:
        return 0
    
    angle_weights = defaultdict(float)
    
    for angle, length in zip(angles, lengths):
        rounded_angle = round(angle)
        angle_weights[rounded_angle] += length
    
    if angle_weights:
        best_angle = max(angle_weights.items(), key=lambda x: x[1])[0]
        return best_angle
    
    return 0

def rotate_image(image, angle):
    """
    Rotate image by given angle
    """
    if angle == 0:
        return image
    
    height, width = image.shape[:2]
    center = (width // 2, height // 2)
    
    rotation_matrix = cv2.getRotationMatrix2D(center, -angle, 1.0)
    rotated = cv2.warpAffine(image, rotation_matrix, (width, height), 
                            flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
    
    return rotated

def filter_lines_by_angle(lines, target_angle, angle_tolerance=10, min_length=10):
    """
    Filter line segments based on target angle and minimum length
    """
    if lines is None or len(lines) == 0:
        return []
    
    filtered_lines = []
    
    for line in lines:
        x1, y1, x2, y2 = line
        
        length = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
        
        if length < min_length:
            continue
        
        angle = math.atan2(y2 - y1, x2 - x1) * 180 / math.pi
        if angle < 0:
            angle += 180
        
        angle_diff = min(abs(angle - target_angle), 
                        abs(angle - target_angle + 180),
                        abs(angle - target_angle - 180))
        
        if angle_diff <= angle_tolerance:
            filtered_lines.append(line)
    
    return filtered_lines

def create_convex_hull_mask(image_shape, lines):
    """
    Create mask from convex hull of line segment endpoints
    """
    if not lines:
        return np.zeros(image_shape[:2], dtype=np.uint8)
    
    points = []
    for line in lines:
        x1, y1, x2, y2 = line
        points.extend([(int(x1), int(y1)), (int(x2), int(y2))])
    
    if len(points) < 3:
        return np.zeros(image_shape[:2], dtype=np.uint8)
    
    points = np.array(points, dtype=np.int32)
    hull = cv2.convexHull(points)
    
    mask = np.zeros(image_shape[:2], dtype=np.uint8)
    cv2.fillPoly(mask, [hull], 255)
    
    return mask

def preprocess_for_decoding(image):
    """
    Advanced preprocessing to improve barcode readability
    """
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()
    
    processed_images = []
    
    # Method 1: Original grayscale
    processed_images.append(("original", gray))
    
    # Method 2: Gaussian blur + threshold
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    _, thresh1 = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    processed_images.append(("otsu", thresh1))
    
    # Method 3: Adaptive threshold
    adaptive = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY, 11, 2)
    processed_images.append(("adaptive", adaptive))
    
    # Method 4: Morphological operations
    kernel = np.ones((2,2), np.uint8)
    morph = cv2.morphologyEx(thresh1, cv2.MORPH_CLOSE, kernel)
    processed_images.append(("morph", morph))
    
    # Method 5: Histogram equalization
    equalized = cv2.equalizeHist(gray)
    _, thresh_eq = cv2.threshold(equalized, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    processed_images.append(("equalized", thresh_eq))
    
    # Method 6: Contrast enhancement
    enhanced = cv2.convertScaleAbs(gray, alpha=1.5, beta=30)
    _, thresh_enh = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    processed_images.append(("enhanced", thresh_enh))
    
    return processed_images

def try_multiple_decoding_methods(image):
    """
    Try multiple preprocessing methods for better decoding
    """
    processed_images = preprocess_for_decoding(image)
    
    for method_name, processed_img in processed_images:
        scales = [1.0, 1.5, 2.0, 0.8]
        
        for scale in scales:
            if scale != 1.0:
                height, width = processed_img.shape
                new_width = int(width * scale)
                new_height = int(height * scale)
                scaled_img = cv2.resize(processed_img, (new_width, new_height), 
                                      interpolation=cv2.INTER_CUBIC)
            else:
                scaled_img = processed_img
            
            barcodes = pyzbar.decode(scaled_img)
            if barcodes:
                print(f"✅ Decoded with method: {method_name}, scale: {scale}")
                return barcodes, scaled_img, method_name
    
    return [], None, "failed"

def enhanced_barcode_detection(cropped_img):
    """
    Enhanced barcode detection following the paper's methodology
    """
    original_height, original_width = cropped_img.shape[:2]
    
    # Resize if too small
    if original_width < 100:
        scale_factor = 100 / original_width
        new_width = int(original_width * scale_factor)
        new_height = int(original_height * scale_factor)
        cropped_img = cv2.resize(cropped_img, (new_width, new_height), 
                               interpolation=cv2.INTER_CUBIC)
        print(f"🔍 Upscaled image: {original_width}x{original_height} -> {new_width}x{new_height}")
    
    # Try multiple decoding methods first
    barcodes, best_img, method = try_multiple_decoding_methods(cropped_img)
    if barcodes:
        return barcodes, best_img, 0, [], method
    
    # Stage 1.2: Line Segment Detection
    lines = detect_line_segments(cropped_img)
    
    if lines is None or len(lines) == 0:
        print("⚠️ No lines detected, using original processing")
        return barcodes, best_img if best_img is not None else cv2.cvtColor(cropped_img, cv2.COLOR_BGR2GRAY), 0, [], "fallback"
    
    angles, lengths = calculate_line_angles_and_lengths(lines)
    rotation_angle = predict_rotation_angle(angles, lengths)
    print(f"🔄 Detected rotation angle: {rotation_angle}°")
    
    # Stage 2.1: Rotate image
    rotated_img = rotate_image(cropped_img, rotation_angle)
    
    barcodes, best_img, method = try_multiple_decoding_methods(rotated_img)
    if barcodes:
        return barcodes, best_img, rotation_angle, [], f"rotated_{method}"
    
    # Stage 2.2: Filter lines and create region
    rotated_lines = detect_line_segments(rotated_img)
    
    if rotated_lines is not None:
        filtered_lines = filter_lines_by_angle(rotated_lines, 0, angle_tolerance=15)
        if len(filtered_lines) < 3:
            filtered_lines = filter_lines_by_angle(rotated_lines, 90, angle_tolerance=15)
        
        print(f"📏 Found {len(filtered_lines)} filtered lines")
        
        if filtered_lines:
            mask = create_convex_hull_mask(rotated_img.shape, filtered_lines)
            masked_img = cv2.bitwise_and(rotated_img, rotated_img, mask=mask)
            
            barcodes, best_img, method = try_multiple_decoding_methods(masked_img)
            if barcodes:
                return barcodes, best_img, rotation_angle, filtered_lines, f"masked_{method}"
    
    gray = cv2.cvtColor(rotated_img, cv2.COLOR_BGR2GRAY)
    return [], gray, rotation_angle, [], "no_decode"

def process_detections(frame):
    """
    ✅ ประมวลผล frame ผ่าน ONNX model และตรวจหา barcodes
    """
    if session is None:
        return {
            'success': False,
            'error': 'โมเดล ONNX ยังไม่ถูกโหลด'
        }
    
    try:
        # ✅ Preprocess input สำหรับ ONNX
        input_tensor = preprocess_frame(frame)
        
        # ✅ รัน ONNX inference
        outputs = session.run(None, {input_name: input_tensor})
        
        # ✅ Postprocess outputs
        detections = postprocess_outputs(outputs, frame.shape)
        
        detection_results = []
        barcode_results = []
        
        # ประมวลผล detections แต่ละตัว
        for detection in detections:
            x1, y1, x2, y2 = detection['xmin'], detection['ymin'], detection['xmax'], detection['ymax']
            confidence = detection['confidence']
            
            detection_results.append(detection)
            
            # Crop และวิเคราะห์ barcode
            cropped_img = frame[y1:y2, x1:x2]
            
            if cropped_img.size > 0:
                barcodes, processed_img, rotation_angle, filtered_lines, decode_method = enhanced_barcode_detection(cropped_img)
                
                for barcode in barcodes:
                    data = barcode.data.decode("utf-8")
                    barcode_result = {
                        'data': data,
                        'type': barcode.type,
                        'rotation_angle': rotation_angle,
                        'decode_method': decode_method,
                        'confidence': confidence,
                        'bbox': detection
                    }
                    barcode_results.append(barcode_result)
                    print(f"🎯 Successfully decoded: {data} using {decode_method}")
        
        return {
            'success': True,
            'detections': detection_results,
            'barcodes': barcode_results,
            'rotation_angle': barcode_results[0]['rotation_angle'] if barcode_results else 0,
            'decode_method': barcode_results[0]['decode_method'] if barcode_results else '',
            'confidence': barcode_results[0]['confidence'] if barcode_results else 0
        }
        
    except Exception as e:
        print(f"Error in process_detections: {e}")
        return {
            'success': False,
            'error': str(e)
        }

@app.route('/api/detect-barcode', methods=['POST'])
def detect_barcode():
    try:
        # ตรวจสอบว่ามีไฟล์รูปภาพหรือไม่
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'ไม่พบไฟล์รูปภาพ'
            }), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'ไม่ได้เลือกไฟล์'
            }), 400
        
        # อ่านรูปภาพ
        image_bytes = file.read()
        
        # แปลงเป็น numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({
                'success': False,
                'error': 'ไม่สามารถอ่านไฟล์รูปภาพได้'
            }), 400
        
        # ประมวลผล
        result = process_detections(frame)
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in detect_barcode endpoint: {e}")
        return jsonify({
            'success': False,
            'error': f'เกิดข้อผิดพลาดในการประมวลผล: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """✅ อัพเดท Health check endpoint สำหรับ ONNX"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': session is not None,
        'model_type': 'ONNX Runtime',
        'providers': session.get_providers() if session else [],
        'input_shape': input_shape if session else None
    })

if __name__ == '__main__':
    print(f"🚀 Starting server with ONNX Runtime")
    print(f"📱 Model loaded: {session is not None}")
    if session:
        print(f"🔧 Available providers: {session.get_providers()}")
        print(f"📊 Input shape: {input_shape}")
    app.run(host='0.0.0.0', port=8000, debug=True)