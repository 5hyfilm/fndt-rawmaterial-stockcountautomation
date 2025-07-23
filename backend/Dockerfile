# Path: /backend/Dockerfile
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libzbar0 \
    libzbar-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    curl \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# ⭐ สร้าง user และ home directory ด้วย permission ที่ถูกต้อง
RUN groupadd -r appuser && \
    useradd -r -g appuser -d /home/appuser -m appuser && \
    mkdir -p /home/appuser/.cache && \
    mkdir -p /app/uploads /app/models && \
    chown -R appuser:appuser /home/appuser && \
    chown -R appuser:appuser /app

# ⭐ ตั้งค่า environment variables สำหรับ PyTorch cache
ENV TORCH_HOME=/home/appuser/.cache/torch
ENV HF_HOME=/home/appuser/.cache/huggingface
ENV TRANSFORMERS_CACHE=/home/appuser/.cache/huggingface
ENV XDG_CACHE_HOME=/home/appuser/.cache

# Download YOLOv5 model if not exists (optional)
# RUN if [ ! -f model.pt ]; then \
#     python -c "import torch; torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)" \
#     ; fi

# ⭐ สร้าง cache directories ด้วย permission ที่ถูกต้อง
RUN mkdir -p /home/appuser/.cache/torch/hub && \
    mkdir -p /home/appuser/.cache/huggingface && \
    chown -R appuser:appuser /home/appuser/.cache

# Switch to non-root user
USER appuser

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Start the application
CMD ["python", "app.py"]