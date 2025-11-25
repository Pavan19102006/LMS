const Notification = require('../models/Notification');
const User = require('../models/User');
const Course = require('../models/Course');

/**
 * Create notification for specific user
 */
const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Notify all instructors when admin creates a course
 */
const notifyInstructorsAboutNewCourse = async (course, adminUser) => {
  try {
    const instructors = await User.find({ role: 'instructor', status: 'active' });
    
    const notifications = instructors.map(instructor => ({
      recipient: instructor._id,
      type: 'course_created',
      title: 'New Course Available',
      message: `Admin ${adminUser.firstName} ${adminUser.lastName} has created a new course: "${course.title}"`,
      relatedCourse: course._id,
      relatedUser: adminUser._id,
      link: `/courses/${course._id}`,
      priority: 'medium'
    }));

    await Notification.insertMany(notifications);
    console.log(`Notified ${instructors.length} instructors about new course`);
  } catch (error) {
    console.error('Error notifying instructors:', error);
  }
};

/**
 * Notify all enrolled students when instructor creates an assignment
 */
const notifyStudentsAboutNewAssignment = async (assignment, course, instructor) => {
  try {
    // Get all enrolled students in the course
    const enrolledStudents = course.enrolledStudents || [];
    
    if (enrolledStudents.length === 0) {
      console.log('No students enrolled in this course yet');
      return;
    }

    const notifications = enrolledStudents.map(enrollment => ({
      recipient: enrollment.student,
      type: 'assignment_created',
      title: 'New Assignment Posted',
      message: `${instructor.firstName} ${instructor.lastName} has posted a new assignment "${assignment.title}" for ${course.title}. Due: ${new Date(assignment.dueDate).toLocaleDateString()}`,
      relatedAssignment: assignment._id,
      relatedCourse: course._id,
      relatedUser: instructor._id,
      link: `/assignments/${assignment._id}`,
      priority: 'high'
    }));

    await Notification.insertMany(notifications);
    console.log(`Notified ${enrolledStudents.length} students about new assignment`);
  } catch (error) {
    console.error('Error notifying students about assignment:', error);
  }
};

/**
 * Notify instructor when student submits assignment
 */
const notifyInstructorAboutSubmission = async (assignment, student, instructor) => {
  try {
    await createNotification({
      recipient: instructor._id,
      type: 'submission_received',
      title: 'New Assignment Submission',
      message: `${student.firstName} ${student.lastName} has submitted "${assignment.title}"`,
      relatedAssignment: assignment._id,
      relatedUser: student._id,
      link: `/assignments/${assignment._id}`,
      priority: 'medium'
    });
  } catch (error) {
    console.error('Error notifying instructor about submission:', error);
  }
};

/**
 * Notify student when their assignment is graded
 */
const notifyStudentAboutGrade = async (assignment, student, instructor, grade) => {
  try {
    await createNotification({
      recipient: student._id,
      type: 'assignment_graded',
      title: 'Assignment Graded',
      message: `Your assignment "${assignment.title}" has been graded. Score: ${grade.points}/${assignment.maxPoints}`,
      relatedAssignment: assignment._id,
      relatedUser: instructor._id,
      link: `/assignments/${assignment._id}`,
      priority: 'high'
    });
  } catch (error) {
    console.error('Error notifying student about grade:', error);
  }
};

/**
 * Notify instructor when student enrolls in their course
 */
const notifyInstructorAboutEnrollment = async (course, student, instructor) => {
  try {
    await createNotification({
      recipient: instructor._id,
      type: 'new_enrollment',
      title: 'New Student Enrollment',
      message: `${student.firstName} ${student.lastName} has enrolled in your course "${course.title}"`,
      relatedCourse: course._id,
      relatedUser: student._id,
      link: `/courses/${course._id}`,
      priority: 'low'
    });
  } catch (error) {
    console.error('Error notifying instructor about enrollment:', error);
  }
};

/**
 * Notify students when a course is published
 */
const notifyStudentsAboutPublishedCourse = async (course, instructor) => {
  try {
    const students = await User.find({ role: 'student', status: 'active' });
    
    const notifications = students.map(student => ({
      recipient: student._id,
      type: 'course_published',
      title: 'New Course Published',
      message: `${instructor.firstName} ${instructor.lastName} has published a new course: "${course.title}"`,
      relatedCourse: course._id,
      relatedUser: instructor._id,
      link: `/courses/${course._id}`,
      priority: 'medium'
    }));

    await Notification.insertMany(notifications);
    console.log(`Notified ${students.length} students about published course`);
  } catch (error) {
    console.error('Error notifying students about published course:', error);
  }
};

/**
 * Notify specific user about course assignment
 */
const notifyUserAboutCourseAssignment = async (course, assignedUser, assignedBy) => {
  try {
    await createNotification({
      recipient: assignedUser._id,
      type: 'course_assigned',
      title: 'Course Assigned to You',
      message: `${assignedBy.firstName} ${assignedBy.lastName} has assigned you to teach "${course.title}"`,
      relatedCourse: course._id,
      relatedUser: assignedBy._id,
      link: `/courses/${course._id}`,
      priority: 'high'
    });
  } catch (error) {
    console.error('Error notifying user about course assignment:', error);
  }
};

module.exports = {
  createNotification,
  notifyInstructorsAboutNewCourse,
  notifyStudentsAboutNewAssignment,
  notifyInstructorAboutSubmission,
  notifyStudentAboutGrade,
  notifyInstructorAboutEnrollment,
  notifyStudentsAboutPublishedCourse,
  notifyUserAboutCourseAssignment
};
