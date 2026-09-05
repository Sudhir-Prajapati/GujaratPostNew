# Gujarat Post — Backend API

Node.js, Express, and TypeScript backend for Gujarat Post news platform and admin management CMS.

---

## 🛠️ Setup & Scripts

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Start development server
npm run dev

# Compile TypeScript to dist/
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database models & relationships
│   └── seed.ts             # Initial database seeder
├── src/
│   ├── config/             # Environment, DB, Cloudinary & Redis configurations
│   ├── controllers/        # Express request handlers
│   ├── middlewares/        # Authentication, Validation, Error Handling
│   ├── routes/             # Public & Admin API endpoints
│   ├── services/           # Business logic & 3rd party integrations
│   └── index.ts            # Application entry point
└── scripts/                # Database migrations & build scripts
```
