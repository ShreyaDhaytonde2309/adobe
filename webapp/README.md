# Connecting the Dots - Adobe Challenge WebApp

A complete full-stack web application for Adobe's "Connecting the Dots" Challenge, featuring PDF outline extraction, persona-driven analysis, and beautiful document viewing with Adobe PDF Embed API.

## 🏗 Architecture

- *Backend*: FastAPI (Python) with async processing
- *Frontend*: React with Material-UI for responsive design
- *PDF Processing*: PyMuPDF + lightweight ML models
- *Document Viewing*: Adobe PDF Embed API integration
- *Deployment*: Docker containers with multi-stage builds

## ✅ Requirements Compliance

### Round 1A - PDF Outline Extraction
- ✅ AMD64 architecture support
- ✅ CPU-only processing (no GPU)
- ✅ ≤10 seconds processing time
- ✅ ≤200MB model size
- ✅ Offline operation (no network calls)
- ✅ H1/H2/H3 heading detection

### Round 1B - Persona Analysis
- ✅ 3-10 document support
- ✅ ≤60 seconds processing time
- ✅ ≤1GB model size
- ✅ CPU-only processing
- ✅ Persona-driven ranking

### Round 2 - WebApp
- ✅ Adobe PDF Embed API integration
- ✅ Responsive design
- ✅ Beautiful UI with Material-UI
- ✅ File upload with progress bars
- ✅ Interactive PDF viewing

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.10+ (for local development)

### 1. Clone Repository