# 🎓 Learning Management System (LMS)

A comprehensive, full-stack Learning Management System built with modern web technologies. This platform supports multiple user roles including Admin, Instructor, Student, and Content Creator with role-based authentication and course management capabilities.

## 🚀 Live Deployments

- **Vercel**: [https://lms-ph8u6qbz3-boppanapavanprasads-projects.vercel.app](https://lms-ph8u6qbz3-boppanapavanprasads-projects.vercel.app)
- **Netlify**: [https://lmsfed.netlify.app](https://lmsfed.netlify.app)

### Demo Credentials
- **Admin:** `admin@lms.com` / `admin123`
- **Student:** `student@lms.com` / `admin123`  
- **Instructor:** `instructor@lms.com` / `admin123`

## 🏗️ Architecture

- **Frontend:** React 18, TypeScript, Material-UI, React Router
- **Backend:** Node.js, Express.js, JWT Authentication
- **Database:** MongoDB (with in-memory demo mode)
- **Deployment:** Vercel (Unified Full-Stack App)
- **Authentication:** Role-based access (Admin, Instructor, Student, Content Creator)

## 📁 Project Structure

```
LMS/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── contexts/       # React Context (Auth, etc.)
│   │   ├── utils/         # Utilities (axios config)
│   │   └── ...
│   └── package.json
├── server/                # Node.js Backend  
│   ├── routes/           # API Routes
│   ├── models/           # Database Models
│   ├── middleware/       # Auth Middleware
│   └── index.js          # Server Entry Point
├── vercel.json           # Vercel Configuration
└── package.json          # Root Package Config
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm 9+

### Local Setup
```bash
# Install dependencies
npm run setup

# Start development servers
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:5001
```

### Build & Deploy
```bash
# Build client
npm run build

# Deploy to Vercel
npm run deploy
```

## 🔧 Key Features

- **Multi-Role Authentication** (Admin, Instructor, Student, Content Creator)
- **Course Management** with assignments and materials
- **User Dashboard** with role-specific views
- **Responsive Design** with Material-UI
- **RESTful API** with JWT authentication
- **Unified Deployment** (Frontend + Backend on same domain)

## 🌐 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/courses` - List courses
- `GET /api/assignments` - List assignments

## 📝 Environment Variables

Create `.env.production` for production:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

## 🚀 Deployment Status

✅ **Deployed and Working**
- Frontend and Backend unified on Vercel
- Role-based authentication system
- Demo mode with in-memory data
- Production-ready configuration

---

**Built with ❤️ for modern learning experiences**
