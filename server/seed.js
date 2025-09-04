const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const Course = require('./models/Course');
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb:
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding');
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data');
    const demoUsers = [
      {
        email: 'admin@lms.com',
        password: 'admin123',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        status: 'active'
      },
      {
        email: 'instructor@lms.com',
        password: 'instructor123',
        firstName: 'John',
        lastName: 'Smith',
        role: 'instructor',
        status: 'active'
      },
      {
        email: 'instructor2@lms.com',
        password: 'instructor123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'instructor',
        status: 'active'
      },
      {
        email: 'student@lms.com',
        password: 'student123',
        firstName: 'Alice',
        lastName: 'Cooper',
        role: 'student',
        status: 'active'
      },
      {
        email: 'student2@lms.com',
        password: 'student123',
        firstName: 'Bob',
        lastName: 'Wilson',
        role: 'student',
        status: 'active'
      },
      {
        email: 'creator@lms.com',
        password: 'creator123',
        firstName: 'Emma',
        lastName: 'Davis',
        role: 'content_creator',
        status: 'active'
      }
    ];
    const createdUsers = [];
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.email}`);
    }
    const instructors = createdUsers.filter(user => user.role === 'instructor');
    const demoCourses = [
      {
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern web applications.',
        instructor: instructors[0]._id,
        category: 'Programming',
        level: 'Beginner',
        duration: { weeks: 8, hoursPerWeek: 5 },
        maxStudents: 50,
        price: 99.99,
        isPublished: true,
        publishedDate: new Date(),
        syllabus: [
          {
            week: 1,
            title: 'HTML Fundamentals',
            description: 'Learn the basics of HTML structure and elements',
            lessons: [
              {
                title: 'Introduction to HTML',
                description: 'Understanding HTML structure and syntax',
                duration: 45,
                resources: []
              },
              {
                title: 'HTML Elements and Attributes',
                description: 'Working with different HTML elements',
                duration: 60,
                resources: []
              }
            ]
          },
          {
            week: 2,
            title: 'CSS Styling',
            description: 'Style your web pages with CSS',
            lessons: [
              {
                title: 'CSS Basics',
                description: 'Introduction to CSS selectors and properties',
                duration: 50,
                resources: []
              }
            ]
          }
        ],
        prerequisites: ['Basic computer literacy'],
        learningObjectives: [
          'Build responsive web pages',
          'Understand HTML structure',
          'Style websites with CSS',
          'Add interactivity with JavaScript'
        ],
        tags: ['HTML', 'CSS', 'JavaScript', 'Web Development']
      },
      {
        title: 'Advanced React Development',
        description: 'Master React hooks, context, and state management for building complex applications.',
        instructor: instructors[1]._id,
        category: 'Programming',
        level: 'Advanced',
        duration: { weeks: 12, hoursPerWeek: 6 },
        maxStudents: 30,
        price: 199.99,
        isPublished: true,
        publishedDate: new Date(),
        syllabus: [
          {
            week: 1,
            title: 'React Hooks Deep Dive',
            description: 'Advanced patterns with React hooks',
            lessons: [
              {
                title: 'Custom Hooks',
                description: 'Creating reusable custom hooks',
                duration: 90,
                resources: []
              }
            ]
          }
        ],
        prerequisites: ['JavaScript ES6+', 'Basic React knowledge'],
        learningObjectives: [
          'Master React hooks',
          'Implement complex state management',
          'Build scalable React applications',
          'Optimize React performance'
        ],
        tags: ['React', 'JavaScript', 'Hooks', 'State Management']
      },
      {
        title: 'Python Programming Basics',
        description: 'Start your programming journey with Python, one of the most popular languages.',
        instructor: instructors[0]._id,
        category: 'Programming',
        level: 'Beginner',
        duration: { weeks: 6, hoursPerWeek: 4 },
        maxStudents: 60,
        price: 79.99,
        isPublished: true,
        publishedDate: new Date(),
        syllabus: [
          {
            week: 1,
            title: 'Python Fundamentals',
            description: 'Variables, data types, and basic operations',
            lessons: [
              {
                title: 'Getting Started with Python',
                description: 'Setting up Python and writing your first program',
                duration: 60,
                resources: []
              }
            ]
          }
        ],
        prerequisites: ['No prior programming experience required'],
        learningObjectives: [
          'Understand Python syntax',
          'Work with data structures',
          'Build simple programs',
          'Solve problems with code'
        ],
        tags: ['Python', 'Programming', 'Beginner']
      }
    ];
    for (const courseData of demoCourses) {
      const course = new Course(courseData);
      await course.save();
      console.log(`Created course: ${course.title}`);
    }
    console.log('Database seeded successfully!');
    console.log('\nDemo accounts created:');
    console.log('Admin: admin@lms.com / admin123');
    console.log('Instructor: instructor@lms.com / instructor123');
    console.log('Student: student@lms.com / student123');
    console.log('Content Creator: creator@lms.com / creator123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};
seedDatabase();
