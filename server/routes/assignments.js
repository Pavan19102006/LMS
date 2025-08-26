const express = require('express');
const { body, validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/assignments
// @desc    Get assignments (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      courseId = '', 
      status = '',
      dueDate = ''
    } = req.query;
    
    // Build query based on user role
    let query = {};
    
    if (req.user.role === 'student') {
      // Students see assignments from their enrolled courses
      const userCourses = req.user.enrolledCourses.map(enrollment => enrollment.courseId);
      query.course = { $in: userCourses };
      query.isPublished = true;
    } else if (req.user.role === 'instructor') {
      // Instructors see assignments from their courses
      query.instructor = req.user._id;
    }
    // Admins see all assignments (no additional filter)
    
    if (courseId) {
      query.course = courseId;
    }
    
    if (dueDate) {
      const date = new Date(dueDate);
      query.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999))
      };
    }

    const assignments = await Assignment.find(query)
      .populate('course', 'title')
      .populate('instructor', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ dueDate: 1 });

    const total = await Assignment.countDocuments(query);

    res.json({
      assignments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get assignment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'title')
      .populate('instructor', 'firstName lastName email')
      .populate('submissions.student', 'firstName lastName email')
      .populate('submissions.grade.gradedBy', 'firstName lastName');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check access permissions
    if (req.user.role === 'student') {
      // Students can only see published assignments from their enrolled courses
      const isEnrolled = req.user.enrolledCourses.some(
        enrollment => enrollment.courseId.toString() === assignment.course._id.toString()
      );
      
      if (!assignment.isPublished || !isEnrolled) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Filter submissions to only show student's own submission
      assignment.submissions = assignment.submissions.filter(
        sub => sub.student._id.toString() === req.user._id.toString()
      );
    } else if (req.user.role === 'instructor') {
      // Instructors can only see assignments from their courses
      if (assignment.instructor._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    // Admins can see all assignments

    res.json(assignment);
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Server error fetching assignment' });
  }
});

// @route   POST /api/assignments
// @desc    Create new assignment
// @access  Private/Instructor or Admin
router.post('/', auth, authorize('instructor', 'admin'), [
  body('title').trim().notEmpty().withMessage('Assignment title is required'),
  body('description').notEmpty().withMessage('Assignment description is required'),
  body('course').isMongoId().withMessage('Valid course ID is required'),
  body('type').isIn(['quiz', 'project', 'essay', 'presentation', 'other']).withMessage('Invalid assignment type'),
  body('maxPoints').isInt({ min: 1 }).withMessage('Max points must be at least 1'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('instructions').notEmpty().withMessage('Instructions are required')
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

    // Verify course exists and user has access
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor of this course or admin
    const isInstructor = course.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Access denied. You can only create assignments for your courses.' });
    }

    const assignmentData = {
      ...req.body,
      instructor: req.user._id
    };

    const assignment = new Assignment(assignmentData);
    await assignment.save();

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('course', 'title')
      .populate('instructor', 'firstName lastName email');

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment: populatedAssignment
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error creating assignment' });
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update assignment
// @access  Private/Assignment Instructor or Admin
router.put('/:id', auth, [
  body('title').optional().trim().notEmpty().withMessage('Assignment title cannot be empty'),
  body('type').optional().isIn(['quiz', 'project', 'essay', 'presentation', 'other']).withMessage('Invalid assignment type'),
  body('maxPoints').optional().isInt({ min: 1 }).withMessage('Max points must be at least 1'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required')
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

    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user is instructor of this assignment or admin
    const isInstructor = assignment.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = req.body;
    delete updates._id;
    delete updates.instructor;
    delete updates.course;
    delete updates.submissions; // Prevent direct manipulation of submissions

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
    .populate('course', 'title')
    .populate('instructor', 'firstName lastName email');

    res.json({
      message: 'Assignment updated successfully',
      assignment: updatedAssignment
    });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Server error updating assignment' });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Private/Assignment Instructor or Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user is instructor of this assignment or admin
    const isInstructor = assignment.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if assignment has submissions
    if (assignment.submissions.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete assignment with submissions. Please grade all submissions first.' 
      });
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Server error deleting assignment' });
  }
});

// @route   POST /api/assignments/:id/submit
// @desc    Submit assignment
// @access  Private/Student
router.post('/:id/submit', auth, authorize('student'), [
  body('content.text').optional().trim(),
  body('content.attachments').optional().isArray()
], async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (!assignment.isPublished) {
      return res.status(400).json({ message: 'Assignment is not published yet' });
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(assignment.course);
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === req.user._id.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({ message: 'You must be enrolled in the course to submit assignments' });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      // Check if multiple attempts are allowed
      if (assignment.settings.maxAttempts === 1) {
        return res.status(400).json({ message: 'Assignment already submitted. Multiple attempts not allowed.' });
      }
      
      // For now, we'll replace the existing submission
      // In a more complex system, you might want to track multiple attempts
      assignment.submissions = assignment.submissions.filter(
        sub => sub.student.toString() !== req.user._id.toString()
      );
    }

    // Create submission
    const submission = {
      student: req.user._id,
      submissionDate: new Date(),
      content: req.body.content || {},
      isLate: new Date() > assignment.dueDate,
      status: 'submitted'
    };

    assignment.submissions.push(submission);
    await assignment.save();

    res.json({ 
      message: 'Assignment submitted successfully',
      isLate: submission.isLate
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ message: 'Server error submitting assignment' });
  }
});

// @route   POST /api/assignments/:id/grade/:submissionId
// @desc    Grade assignment submission
// @access  Private/Instructor or Admin
router.post('/:id/grade/:submissionId', auth, authorize('instructor', 'admin'), [
  body('points').isFloat({ min: 0 }).withMessage('Points must be 0 or greater'),
  body('feedback').optional().trim()
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

    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user is instructor of this assignment or admin
    const isInstructor = assignment.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const submission = assignment.submissions.id(req.params.submissionId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const { points, feedback } = req.body;

    // Validate points don't exceed maximum
    if (points > assignment.maxPoints) {
      return res.status(400).json({ 
        message: `Points cannot exceed maximum of ${assignment.maxPoints}` 
      });
    }

    submission.grade = {
      points,
      feedback: feedback || '',
      gradedBy: req.user._id,
      gradedDate: new Date()
    };
    submission.status = 'graded';

    await assignment.save();

    res.json({ 
      message: 'Assignment graded successfully',
      grade: submission.grade
    });
  } catch (error) {
    console.error('Grade assignment error:', error);
    res.status(500).json({ message: 'Server error grading assignment' });
  }
});

// @route   POST /api/assignments/:id/publish
// @desc    Publish/unpublish assignment
// @access  Private/Assignment Instructor or Admin
router.post('/:id/publish', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if user is instructor of this assignment or admin
    const isInstructor = assignment.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    assignment.isPublished = !assignment.isPublished;
    if (assignment.isPublished && !assignment.publishDate) {
      assignment.publishDate = new Date();
    }

    await assignment.save();

    res.json({ 
      message: `Assignment ${assignment.isPublished ? 'published' : 'unpublished'} successfully`,
      isPublished: assignment.isPublished
    });
  } catch (error) {
    console.error('Publish assignment error:', error);
    res.status(500).json({ message: 'Server error updating assignment publication status' });
  }
});

module.exports = router;
