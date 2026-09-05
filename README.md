# Gujarat Post — News & Media Portal

A modern, high-performance Gujarati & Multi-language Digital News Platform featuring a Next.js 15+ frontend, Express & TypeScript backend, Prisma ORM, Redis caching, Live Newsroom ticker, E-Paper generator, Video desk, Reels/Stories, and a full-featured Admin CMS.

---

## 🚀 Architecture Overview

```
Gujarat Post/
├── frontend/                # Next.js App Router (Turbopack, TailwindCSS, ISR)
│   ├── app/                 # Next.js Pages & Route Handlers
│   ├── components/          # UI Components, Layout, Modals, Audio Reader, E-Paper
│   ├── lib/                 # API Client, Cache, Helpers, Auth
│   └── public/              # Static Assets & Icons
│
├── backend/                 # Node.js + Express + TypeScript Backend
│   ├── src/                 # Controllers, Routes, Middleware, Services
│   ├── prisma/              # Prisma Schema & Database Migrations
│   └── scripts/             # Seeding & Build Automation Scripts
│
└── gujaratpost_database_dump.sql # Complete Database Seed Dump
```

---

## ⚡ Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router, Turbopack)
- **Styling**: Vanilla CSS + TailwindCSS Design System with custom theme tokens
- **Features**: 
  - Dynamic ISR (Incremental Static Regeneration)
  - 3D Animated Newsroom Loader & Micro-interactions
  - E-Paper Reader & Canvas Generator
  - Live Instagram Reels & YouTube Integration
  - Web Stories & Photo Gallery
  - Multi-language support (Gujarati, Hindi, English)
  - Dark & Light Mode Support
  - Text-to-Speech Gujarati Audio Reader

### Backend
- **Runtime**: Node.js & Express with TypeScript
- **Database**: MySQL / TiDB / Aiven Cloud via Prisma ORM
- **Authentication**: JWT & HttpOnly Secure Cookies
- **File & Media Storage**: Cloudinary / Local Uploads
- **Caching**: In-memory LRU + Redis support
- **Mailing & Alerts**: Nodemailer / Resend

---

## 🛠️ Quick Start Guide

### Prerequisites
- Node.js >= 20.x
- npm or yarn
- MySQL database instance

---

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Update your DATABASE_URL and secrets
npm run db:generate    # Generate Prisma client
npm run dev            # Start API server on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev            # Start Next.js dev server on http://localhost:3000
```

---

## 📦 Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

---

## 🔒 Environment Variables

### Backend (`backend/.env`)
- `PORT`: Server port (default: `5000`)
- `DATABASE_URL`: MySQL connection URI
- `JWT_SECRET`: Secret key for authentication tokens
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Media upload credentials

### Frontend (`frontend/.env`)
- `NEXT_PUBLIC_API_URL`: Backend API URL (e.g. `http://localhost:5000/api/public`)

---

## 📄 License
All rights reserved © Gujarat Post.
