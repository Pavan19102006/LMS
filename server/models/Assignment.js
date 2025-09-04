const mongoose = require('mongoose');
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['quiz', 'project', 'essay', 'presentation', 'other'],
    required: true
  },
  maxPoints: {
    type: Number,
    required: true,
    min: 1
  },
  dueDate: {
    type: Date,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  attachments: [{
    filename: String,
    url: String,
    fileType: String
  }],
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    submissionDate: {
      type: Date,
      default: Date.now
    },
    content: {
      text: String,
      attachments: [{
        filename: String,
        url: String,
        fileType: String
      }]
    },
    grade: {
      points: {
        type: Number,
        min: 0
      },
      feedback: String,
      gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      gradedDate: Date
    },
    isLate: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'returned'],
      default: 'submitted'
    }
  }],
  settings: {
    allowLateSubmissions: {
      type: Boolean,
      default: true
    },
    latePenalty: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    maxAttempts: {
      type: Number,
      default: 1,
      min: 1
    },
    timeLimit: {
      type: Number, 
      default: null
    }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date
  }
}, {
  timestamps: true
});
assignmentSchema.virtual('isOverdue').get(function() {
  return new Date() > this.dueDate;
});
assignmentSchema.virtual('submissionCount').get(function() {
  return this.submissions.length;
});
assignmentSchema.virtual('gradedCount').get(function() {
  return this.submissions.filter(sub => sub.status === 'graded').length;
});
assignmentSchema.virtual('averageGrade').get(function() {
  const gradedSubmissions = this.submissions.filter(sub => 
    sub.grade && sub.grade.points !== undefined
  );
  if (gradedSubmissions.length === 0) return 0;
  const sum = gradedSubmissions.reduce((acc, sub) => acc + sub.grade.points, 0);
  return Math.round((sum / gradedSubmissions.length) * 100) / 100;
});
assignmentSchema.pre('save', function(next) {
  this.submissions.forEach(submission => {
    if (submission.submissionDate > this.dueDate) {
      submission.isLate = true;
    }
  });
  next();
});
assignmentSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});
module.exports = mongoose.model('Assignment', assignmentSchema);
