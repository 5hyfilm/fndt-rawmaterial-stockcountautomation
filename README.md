# Webcam Barcode Scanner & Inventory Management

AI-powered barcode scanning system with Next.js frontend and Python Flask backend using YOLO v5 and OpenCV.

## Features

- **Real-time webcam scanning** with YOLO v5 object detection
- **Multi-format support**: QR Code, Code 128, Code 39, EAN, UPC
- **Multiple barcode types**: KG
- **CSV-based product database** with automatic loading from `/public/product_list_csv.csv`
- **Employee authentication** with branch and session management
- **Inventory tracking** with history logging

## Tech Stack

**Frontend**: Next.js 14, TypeScript, Tailwind CSS  
**Backend**: Flask, YOLO v5, OpenCV, pyzbar  
**DevOps**: Docker, Docker Compose

## Quick Start

### Docker (Recommended)

```bash
git clone https://github.com/5hyfilm/fndt-stockcountautomation.git
cd fndt-stockcountautomation
docker-compose up --build
```

Access at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Local Development

```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
pip(3) install -r requirements.txt
python(3) app.py
```

## Project Structure

```
├── src/
│   ├── app/
│   │   └── api/detect-barcode/    # Barcode detection API route
│   │       └── route.ts           # Next.js API endpoint
│   ├── components/                # React components
│   ├── hooks/                     # Custom React hooks
│   └── types/                     # TypeScript type definitions
├── backend/
│   ├── app.py                     # Flask application entry point
│   ├── requirements.txt           # Python dependencies
│   └── Dockerfile                 # Backend container configuration
├── public/
│   └── product_list_csv.csv       # Product database (CSV format)
├── docker-compose.yml             # Multi-container orchestration
├── Dockerfile                     # Frontend container configuration
├── .dockerignore                  # Docker build exclusions
├── package.json                   # Node.js dependencies
├── next.config.js                 # Next.js configuration
└── README.md                      # Project documentation
```

## Docker Architecture

### Frontend Container

- **Base**: `node:18-alpine`
- **Build**: Multi-stage build with optimization
- **Port**: 3000
- **Health Check**: Built-in Node.js health endpoint

### Backend Container

- **Base**: `python:3.9`
- **ML Dependencies**: OpenCV, YOLO v5, pyzbar
- **Port**: 8000
- **Health Check**: `/api/health` endpoint
- **Security**: Non-root user execution

## API Endpoints

- `POST /api/detect-barcode` - Image barcode detection
- `GET /api/health` - Backend health check

## Usage

1. Open http://localhost:3000
2. Login with employee credentials
3. Allow camera access
4. Scan barcode by positioning in frame
5. View product results and update inventory

## Configuration

### Environment Variables

```bash
# Frontend (.env.local)
PYTHON_BACKEND_URL=http://localhost:8000

# Backend (.env)
FLASK_ENV=production
PYTHONUNBUFFERED=1
```

### Product Data

Place CSV file at `/public/product_list_csv.csv` with format:
Material, Description, Thai Desc., Pack Size, Product Group, Bar Code EA/DSP/CS

## Reference

Based on [Tyan-Ng/Webcam-Barcode-Scanner](https://github.com/Tyan-Ng/Webcam-Barcode-Scanner)
