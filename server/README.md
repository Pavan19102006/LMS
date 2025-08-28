# LMS Backend

## Environment Variables Required

```bash
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://boppanapavan63:lSSetUpdEiwAwTYp@cluster0.u4nzwts.mongodb.net/lms?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=lms-super-secret-jwt-key-2025-production-secure
JWT_EXPIRE=7d
```

## Deploy to Render

1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Select this repository
5. Set build command: `npm install`
6. Set start command: `node index.js`
7. Add the environment variables above

## Deploy to Railway

```bash
railway login --browserless
cd server
railway init
railway add --database postgresql
railway deploy
```

## Deploy to Heroku

```bash
heroku login
heroku create lms-backend-app
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://boppanapavan63:lSSetUpdEiwAwTYp@cluster0.u4nzwts.mongodb.net/lms?retryWrites=true&w=majority&appName=Cluster0"
heroku config:set JWT_SECRET="lms-super-secret-jwt-key-2025-production-secure"
heroku config:set JWT_EXPIRE="7d"
git push heroku main
```
