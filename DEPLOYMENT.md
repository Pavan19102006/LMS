# LMS 24/7 Deployment Guide

## 🏠 **Local Development (24/7)**

### Quick Start
```bash
# Start servers in background
./start-servers.sh

# Stop servers
./stop-servers.sh
```

### Manual Background Process
```bash
# Backend
cd server
nohup npm start > ../logs/backend.log 2>&1 &

# Frontend  
cd client
nohup npm start > ../logs/frontend.log 2>&1 &
```

## 🚀 **Production Deployment Options**

### 1. **PM2 Process Manager (Recommended)**
```bash
# Install PM2 globally
npm install -g pm2

# Build production frontend
cd client && npm run build

# Install serve for static files
npm install -g serve

# Start with PM2
pm2 start ecosystem.config.json

# Save PM2 config
pm2 save

# Auto-start on system reboot
pm2 startup
```

### 2. **Docker Deployment**
```bash
# Create production Docker setup
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. **Cloud Hosting**

#### **Vercel (Frontend)**
```bash
cd client
npm install -g vercel
vercel --prod
```

#### **Railway (Full Stack)**
```bash
# Connect GitHub repo to Railway
# Auto-deploys on push
```

#### **Heroku (Full Stack)**
```bash
# Install Heroku CLI
npm install -g heroku

# Create apps
heroku create lms-backend
heroku create lms-frontend

# Deploy
git push heroku main
```

#### **DigitalOcean App Platform**
```bash
# Connect GitHub repo
# Configure build settings
# Auto-deploy
```

## 🔧 **Production Build Commands**

### Frontend Production Build
```bash
cd client
npm run build
serve -s build -l 3000
```

### Backend Production
```bash
cd server
NODE_ENV=production PORT=5001 node index.js
```

## 📊 **Monitoring**

### Check Status
```bash
# Local processes
ps aux | grep node

# PM2 status
pm2 status
pm2 logs

# View logs
tail -f logs/backend.log
tail -f logs/frontend.log
```

### Health Checks
```bash
# Frontend
curl http://localhost:3000

# Backend API
curl http://localhost:5001/api/health
```

## 🔒 **Security for Production**

1. **Environment Variables**
   - Use `.env.production` 
   - Set strong JWT secrets
   - Configure CORS properly

2. **Reverse Proxy (Nginx)**
   - SSL certificates
   - Rate limiting
   - Load balancing

3. **Database**
   - MongoDB Atlas (cloud)
   - Connection pooling
   - Backup strategy

## 💡 **Quick Deploy Options**

### Option A: Local 24/7 (Development)
```bash
./start-servers.sh
```

### Option B: PM2 (Production-like)
```bash
npm install -g pm2
cd client && npm run build
pm2 start ecosystem.config.json
```

### Option C: Cloud Deploy (Free Tier)
- **Frontend**: Vercel/Netlify
- **Backend**: Railway/Render
- **Database**: MongoDB Atlas

Choose based on your needs:
- **Development**: Use local scripts
- **Production**: Use PM2 or cloud hosting
- **Professional**: Use Docker + cloud services
