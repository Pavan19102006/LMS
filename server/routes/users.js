const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin or own profile
router.get('/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user is admin or accessing their own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId)
      .select('-password')
      .populate('enrolledCourses.courseId', 'title instructor');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

// @route   POST /api/users
// @desc    Create new user (admin only)
// @access  Private/Admin
router.post('/', auth, authorize('admin'), [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('role').isIn(['admin', 'instructor', 'student', 'content_creator']).withMessage('Invalid role')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password, firstName, lastName, role, status = 'active' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role,
      status
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error creating user' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (admin only or own profile)
// @access  Private
router.put('/:id', auth, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('role').optional().isIn(['admin', 'instructor', 'student', 'content_creator']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const userId = req.params.id;
    const updates = req.body;

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = req.user._id.toString() === userId;

    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Non-admin users cannot change role or status
    if (!isAdmin) {
      delete updates.role;
      delete updates.status;
    }

    // Remove sensitive fields
    delete updates.password;
    delete updates._id;
    delete updates.enrolledCourses;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics (admin only)
// @access  Private/Admin
router.get('/stats/overview', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentUsers = await User.find()
      .select('firstName lastName email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole,
      recentUsers
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error fetching user statistics' });
  }
});

// @route   POST /api/users/:id/enroll/:courseId
// @desc    Enroll user in course
// @access  Private
router.post('/:id/enroll/:courseId', auth, async (req, res) => {
  try {
    const { id: userId, courseId } = req.params;

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = req.user._id.toString() === userId;

    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'User is already enrolled in this course' });
    }

    // Add course to enrolled courses
    user.enrolledCourses.push({
      courseId,
      enrollmentDate: new Date(),
      progress: 0
    });

    await user.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Enroll user error:', error);
    res.status(500).json({ message: 'Server error enrolling user' });
  }
});

module.exports = router;
