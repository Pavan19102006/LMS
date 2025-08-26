#!/bin/bash
# Automated Cloud Deployment Script

echo "🚀 Deploying LMS to Cloud for 24/7 operation..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial LMS commit for deployment"
fi

# Build production frontend
echo "🏗️  Building production frontend..."
cd client
npm run build
cd ..

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy frontend to Vercel
echo "🌐 Deploying frontend to Vercel..."
cd client
vercel --prod --yes

# Get the deployment URL
FRONTEND_URL=$(vercel ls | grep production | awk '{print $2}' | head -n1)
echo "✅ Frontend deployed to: $FRONTEND_URL"

# Instructions for backend deployment
echo ""
echo "🔧 Next steps for backend:"
echo "1. Go to https://railway.app"
echo "2. Sign in with GitHub"
echo "3. Create new project from GitHub repo"
echo "4. Select the 'server' folder"
echo "5. Add environment variables:"
echo "   NODE_ENV=production"
echo "   MONGODB_URI=<your-mongodb-atlas-uri>"
echo "   JWT_SECRET=<your-secret-key>"
echo "   FRONTEND_URL=$FRONTEND_URL"
echo ""
echo "🌍 Your LMS will be live 24/7 even when your laptop is off!"
