import { model, models, Schema } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.Module;
}

const moduleSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
  status: {
    required: true,
    type: String,
    default: 'inactive',
  },
  slug: {
    required: true,
    type: String,
  },
  course: {
    required: true,
    type: Schema.ObjectId,
    ref: 'Course',
  },
  lessonIds: {
    type: [
      {
        type: Schema.ObjectId,
        ref: 'Lesson',
      },
    ],
  },
  position: {
    required: true,
    type: Number,
    default: 0,
  },
});

export const Module = models.Module ?? model('Module', moduleSchema);
