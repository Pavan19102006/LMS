const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const demoUsers = [
  {
    id: '1',
    email: 'admin@lms.com',
    password: '$2a$12$LQ8TXWcP3SdyDX8Zq9rZ8eO7FDtjxMSdMfEgzqZ2rZmNnDhO3tXW6', 
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'student@lms.com',
    password: '$2a$12$LQ8TXWcP3SdyDX8Zq9rZ8eO7FDtjxMSdMfEgzqZ2rZmNnDhO3tXW6', 
    name: 'Student User',
    role: 'student'
  },
  {
    id: '3',
    email: 'instructor@lms.com',
    password: '$2a$12$LQ8TXWcP3SdyDX8Zq9rZ8eO7FDtjxMSdMfEgzqZ2rZmNnDhO3tXW6', 
    name: 'Instructor User',
    role: 'instructor'
  }
];
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '7d'
  });
};
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide both email and password' 
      });
    }
    const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }
    const isValidPassword = password === 'admin123';
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }
    const token = generateToken(user.id);
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'student' } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Please provide email, password, and name' 
      });
    }
    const existingUser = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }
    const newUser = {
      id: String(demoUsers.length + 1),
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 12),
      name,
      role
    };
    demoUsers.push(newUser);
    const token = generateToken(newUser.id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = demoUsers.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = demoUsers.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Profile verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});
router.get('/demo-users', (req, res) => {
  res.json({
    success: true,
    message: 'Demo users for testing',
    users: demoUsers.map(user => ({
      email: user.email,
      role: user.role,
      name: user.name
    })),
    loginInfo: {
      password: 'admin123',
      note: 'Use any of the above emails with password: admin123'
    }
  });
});
module.exports = router;
