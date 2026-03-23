import { Schema, model, models } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.Report;
}

const reportSchema = new Schema({
  totalCompletedLessons: {
    required: true,
    type: Array,
  },

  totalCompletedModules: {
    required: true,
    type: Array,
  },

  course: { type: Schema.ObjectId, ref: 'Course' },

  student: { type: Schema.ObjectId, ref: 'User' },

  quizAssessment: { type: Schema.ObjectId, ref: 'Assessment' },

  courseStatus: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress',
  },

  completionDate: Date,
});

export const Report = models.Report ?? model('Report', reportSchema);
