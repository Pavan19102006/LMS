const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Validation utility functions
const validateName = (name) => {
  const errors = [];
  
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
    return { isValid: false, errors };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length > 20) {
    errors.push('Name must be 20 characters or less');
  }
  
  if (trimmedName.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(trimmedName)) {
    errors.push('Name can only contain letters and spaces');
  }
  
  return { isValid: errors.length === 0, errors };
};

const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  const commonPasswords = [
    'password', 'password123', '123456789', 'qwerty123', 
    'admin123', 'welcome123', 'letmein123', 'password1'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('This password is too common. Please choose a stronger password');
  }
  
  return { isValid: errors.length === 0, errors };
};

const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || 'fallback-lms-jwt-secret-2025-temp';
  return jwt.sign({ userId }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Check if email already exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    res.json({ exists: !!existingUser });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ message: 'Server error while checking email' });
  }
});

// Check if name combination already exists
router.post('/check-name', async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'Both first name and last name are required' });
    }
    
    const existingUser = await User.findOne({ 
      firstName: firstName.trim(),
      lastName: lastName.trim()
    });
    
    res.json({ exists: !!existingUser });
  } catch (error) {
    console.error('Check name error:', error);
    res.status(500).json({ message: 'Server error while checking name' });
  }
});
router.post('/register', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .isLength({ max: 254 })
    .withMessage('Email address is too long'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('First name must be between 2 and 20 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('Last name must be between 2 and 20 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  body('role')
    .optional()
    .isIn(['admin', 'instructor', 'student', 'content_creator'])
    .withMessage('Invalid role specified')
], async (req, res) => {
  try {
    // Check express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array().map(err => err.msg)
      });
    }

    const { email, password, firstName, lastName, role } = req.body;
    
    // Additional custom validation
    const firstNameValidation = validateName(firstName);
    const lastNameValidation = validateName(lastName);
    const passwordValidation = validatePassword(password);
    
    const allErrors = [
      ...firstNameValidation.errors,
      ...lastNameValidation.errors,
      ...passwordValidation.errors
    ];
    
    if (allErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: allErrors
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Check if name combination already exists
    const existingNameUser = await User.findOne({ 
      firstName: firstName.trim(),
      lastName: lastName.trim()
    });
    if (existingNameUser) {
      return res.status(400).json({ message: 'This name combination is already taken' });
    }

    const user = new User({
      email: email.toLowerCase().trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: role || 'student'
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      hasJwtSecret: !!process.env.JWT_SECRET
    });
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .isLength({ max: 254 })
    .withMessage('Email address is too long'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1, max: 128 })
    .withMessage('Password length is invalid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array().map(err => err.msg)
      });
    }

    const { email, password } = req.body;
    
    // Additional email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Account is inactive. Please contact administrator.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login date
    user.lastLoginDate = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses.courseId', 'title instructor');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});
router.put('/profile', auth, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }
    const updates = req.body;
    delete updates.password;
    delete updates.role;
    delete updates._id;
    delete updates.enrolledCourses;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});
router.post('/verify-token', auth, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      avatar: req.user.avatar
    }
  });
});
module.exports = router;
