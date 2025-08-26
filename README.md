# Learning Management System (LMS)

A comprehensive full-stack Learning Management System built with React, Node.js, Express, and MongoDB. This LMS supports multiple user roles and provides a complete platform for online education management.

## Features

### 🎯 User Roles
- **Admin**: Manage platform settings, user roles, and course content
- **Instructor**: Create and manage courses, grade assignments, interact with students
- **Student**: Enroll in courses, submit assignments, track progress
- **Content Creator**: Develop course materials, update content, ensure educational quality

### 📚 Core Functionality
- **User Management**: Registration, authentication, role-based access control
- **Course Management**: Create, edit, publish courses with structured content
- **Assignment System**: Create assignments, submit work, grade submissions
- **Progress Tracking**: Monitor student progress and course completion
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🔧 Technical Features
- **Authentication**: JWT-based secure authentication
- **Authorization**: Role-based access control
- **Database**: MongoDB with Mongoose ODM
- **Security**: Rate limiting, input validation, password hashing
- **File Upload**: Support for assignment submissions and course materials
- **Real-time Updates**: Socket.io for live notifications (planned)

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **CORS** for cross-origin requests

## Getting Started

### Prerequisites
- Node.js 16+ installed
- MongoDB installed and running locally or MongoDB Atlas account
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LMS
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   - Copy `server/.env.example` to `server/.env`
   - Update the environment variables:
     ```env
     NODE_ENV=development
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/lms
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     JWT_EXPIRE=7d
     FRONTEND_URL=http://localhost:3000
     ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or start MongoDB service (Linux/macOS)
   sudo systemctl start mongod
   ```

5. **Run the application**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # Or start them separately:
   # Backend (from root directory)
   npm run server
   
   # Frontend (from root directory)
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## Demo Accounts

For testing purposes, you can create demo accounts with these credentials:

### Admin Account
- Email: admin@lms.com
- Password: admin123
- Role: Administrator

### Instructor Account
- Email: instructor@lms.com
- Password: instructor123
- Role: Instructor

### Student Account
- Email: student@lms.com
- Password: student123
- Role: Student

### Content Creator Account
- Email: creator@lms.com
- Password: creator123
- Role: Content Creator

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (Instructor/Admin)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course
- `POST /api/courses/:id/publish` - Publish/unpublish course

### Assignments
- `GET /api/assignments` - Get assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create assignment (Instructor/Admin)
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment
- `POST /api/assignments/:id/submit` - Submit assignment (Student)
- `POST /api/assignments/:id/grade/:submissionId` - Grade submission (Instructor/Admin)

## Project Structure

```
LMS/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Admin/     # Admin-specific components
│   │   │   ├── Auth/      # Authentication components
│   │   │   ├── Common/    # Shared components
│   │   │   ├── Courses/   # Course-related components
│   │   │   ├── Dashboard/ # Dashboard components
│   │   │   └── Layout/    # Layout components
│   │   ├── contexts/      # React contexts
│   │   └── styles/        # CSS and styling
│   ├── package.json       # Frontend dependencies
│   └── tsconfig.json      # TypeScript configuration
├── server/                # Node.js backend
│   ├── middleware/        # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── index.js          # Server entry point
│   ├── package.json      # Backend dependencies
│   └── .env              # Environment variables
├── package.json          # Root package.json
└── README.md            # This file
```

## Development

### Available Scripts

```bash
# Root level scripts
npm run dev              # Start both frontend and backend
npm run install-all      # Install all dependencies
npm run build           # Build frontend for production
npm run start           # Start production server

# Frontend scripts (from client/ directory)
npm start               # Start development server
npm run build          # Build for production
npm test               # Run tests

# Backend scripts (from server/ directory)
npm start              # Start production server
npm run dev           # Start development server with nodemon
npm test              # Run tests
```

### Database Schema

#### User Model
- Authentication and profile information
- Role-based permissions
- Enrolled courses tracking
- Progress monitoring

#### Course Model
- Course content and metadata
- Instructor assignment
- Student enrollment management
- Progress tracking per student

#### Assignment Model
- Assignment details and instructions
- Submission tracking
- Grading system
- Due date management

## Security Features

- **Authentication**: JWT-based stateless authentication
- **Authorization**: Role-based access control (RBAC)
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Express Validator for API endpoints
- **Rate Limiting**: Prevent abuse and DDoS attacks
- **CORS**: Configured for secure cross-origin requests
- **Helmet**: Security headers for Express.js

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Real-time chat and messaging
- [ ] Video conferencing integration
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Integration with external LTI tools
- [ ] Advanced content authoring tools
- [ ] Automated plagiarism detection
- [ ] Multi-language support
- [ ] Advanced notification system
- [ ] Integration with payment gateways

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](issues) section
2. Create a new issue with detailed information
3. Contact the development team

## Acknowledgments

- Material-UI team for the excellent component library
- MongoDB team for the robust database solution
- React team for the powerful frontend framework
- Node.js and Express.js communities for the backend tools
