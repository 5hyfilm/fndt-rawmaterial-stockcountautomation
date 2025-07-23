# Path: /backend/convert_to_onnx.py

import torch
import sys

# โหลด YOLOv5 model แบบเดิม (เหมือน app.py)
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

try:
    print("🔄 Loading YOLOv5 model...")
    model = torch.hub.load('ultralytics/yolov5', 'custom', path='model.pt')
    model.eval()
    
    print("🔄 Converting to ONNX...")
    
    # สร้าง dummy input
    dummy_input = torch.randn(1, 3, 640, 640)
    
    # Export เป็น ONNX
    torch.onnx.export(
        model,
        dummy_input,
        'model.onnx',
        export_params=True,
        opset_version=11,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size', 2: 'height', 3: 'width'},
            'output': {0: 'batch_size'}
        }
    )
    
    print("✅ Successfully converted to model.onnx")
    
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)