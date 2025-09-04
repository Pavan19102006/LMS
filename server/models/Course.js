const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Other']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  duration: {
    weeks: {
      type: Number,
      required: true,
      min: 1
    },
    hoursPerWeek: {
      type: Number,
      required: true,
      min: 1
    }
  },
  maxStudents: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  thumbnail: {
    type: String,
    default: ''
  },
  syllabus: [{
    week: Number,
    title: String,
    description: String,
    lessons: [{
      title: String,
      description: String,
      videoUrl: String,
      duration: Number, 
      resources: [{
        title: String,
        type: {
          type: String,
          enum: ['pdf', 'video', 'link', 'document']
        },
        url: String
      }]
    }]
  }],
  prerequisites: [String],
  learningObjectives: [String],
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedDate: {
    type: Date
  },
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedLessons: [{
      week: Number,
      lessonIndex: Number,
      completedDate: Date
    }]
  }],
  ratings: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});
courseSchema.methods.updateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    return;
  }
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
};
courseSchema.virtual('enrollmentCount').get(function() {
  return this.enrolledStudents.length;
});
courseSchema.virtual('isFull').get(function() {
  return this.enrolledStudents.length >= this.maxStudents;
});
courseSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});
module.exports = mongoose.model('Course', courseSchema);
