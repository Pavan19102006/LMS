const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public (with filters for published courses)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      category = '', 
      level = '',
      published = 'true'
    } = req.query;
    
    // Build query
    let query = {};
    
    // Only show published courses for non-admin users
    if (published === 'true') {
      query.isPublished = true;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (level) {
      query.level = level;
    }

    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public (for published courses)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName email avatar')
      .populate('enrolledStudents.student', 'firstName lastName email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error fetching course' });
  }
});

// @route   POST /api/courses
// @desc    Create new course
// @access  Private/Instructor or Admin
router.post('/', auth, authorize('instructor', 'admin'), [
  body('title').trim().notEmpty().withMessage('Course title is required'),
  body('description').notEmpty().withMessage('Course description is required'),
  body('category').isIn(['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Other']).withMessage('Invalid category'),
  body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level'),
  body('duration.weeks').isInt({ min: 1 }).withMessage('Duration in weeks must be at least 1'),
  body('duration.hoursPerWeek').isInt({ min: 1 }).withMessage('Hours per week must be at least 1'),
  body('maxStudents').isInt({ min: 1 }).withMessage('Max students must be at least 1'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be 0 or greater')
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

    const courseData = {
      ...req.body,
      instructor: req.user._id
    };

    const course = new Course(courseData);
    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('instructor', 'firstName lastName email');

    res.status(201).json({
      message: 'Course created successfully',
      course: populatedCourse
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error creating course' });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Course Instructor or Admin
router.put('/:id', auth, [
  body('title').optional().trim().notEmpty().withMessage('Course title cannot be empty'),
  body('category').optional().isIn(['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Other']).withMessage('Invalid category'),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level'),
  body('duration.weeks').optional().isInt({ min: 1 }).withMessage('Duration in weeks must be at least 1'),
  body('duration.hoursPerWeek').optional().isInt({ min: 1 }).withMessage('Hours per week must be at least 1'),
  body('maxStudents').optional().isInt({ min: 1 }).withMessage('Max students must be at least 1'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be 0 or greater')
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

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor of this course or admin
    const isInstructor = course.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Access denied. You can only edit your own courses.' });
    }

    const updates = req.body;
    delete updates._id;
    delete updates.instructor; // Prevent changing instructor

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('instructor', 'firstName lastName email');

    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error updating course' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private/Course Instructor or Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor of this course or admin
    const isInstructor = course.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own courses.' });
    }

    // Check if course has enrolled students
    if (course.enrolledStudents.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete course with enrolled students. Please unenroll all students first.' 
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error deleting course' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in course
// @access  Private/Student
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isPublished) {
      return res.status(400).json({ message: 'Course is not published yet' });
    }

    // Check if course is full
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({ message: 'Course is full' });
    }

    // Check if already enrolled
    const alreadyEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === req.user._id.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Add student to course
    course.enrolledStudents.push({
      student: req.user._id,
      enrollmentDate: new Date(),
      progress: 0,
      completedLessons: []
    });

    await course.save();

    // Add course to user's enrolled courses
    const user = await User.findById(req.user._id);
    user.enrolledCourses.push({
      courseId: course._id,
      enrollmentDate: new Date(),
      progress: 0
    });

    await user.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({ message: 'Server error enrolling in course' });
  }
});

// @route   POST /api/courses/:id/unenroll
// @desc    Unenroll from course
// @access  Private/Student or Admin
router.post('/:id/unenroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Remove student from course
    course.enrolledStudents = course.enrolledStudents.filter(
      enrollment => enrollment.student.toString() !== req.user._id.toString()
    );

    await course.save();

    // Remove course from user's enrolled courses
    const user = await User.findById(req.user._id);
    user.enrolledCourses = user.enrolledCourses.filter(
      enrollment => enrollment.courseId.toString() !== course._id.toString()
    );

    await user.save();

    res.json({ message: 'Successfully unenrolled from course' });
  } catch (error) {
    console.error('Unenroll course error:', error);
    res.status(500).json({ message: 'Server error unenrolling from course' });
  }
});

// @route   POST /api/courses/:id/publish
// @desc    Publish/unpublish course
// @access  Private/Course Instructor or Admin
router.post('/:id/publish', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor of this course or admin
    const isInstructor = course.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    course.isPublished = !course.isPublished;
    if (course.isPublished && !course.publishedDate) {
      course.publishedDate = new Date();
    }

    await course.save();

    res.json({ 
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      isPublished: course.isPublished
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ message: 'Server error updating course publication status' });
  }
});

// @route   GET /api/courses/instructor/:instructorId
// @desc    Get courses by instructor
// @access  Public
router.get('/instructor/:instructorId', async (req, res) => {
  try {
    const courses = await Course.find({ 
      instructor: req.params.instructorId,
      isPublished: true 
    })
    .populate('instructor', 'firstName lastName email')
    .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({ message: 'Server error fetching instructor courses' });
  }
});

module.exports = router;
