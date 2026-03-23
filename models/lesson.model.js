import { Schema, model, models } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.Lesson;
}

const lessonSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
  duration: Number,
  videoUrl: String,
  published: {
    type: Boolean,
    default: false,
  },
  slug: {
    required: true,
    type: String,
  },
  access: {
    type: String,
    enum: ['public', 'private'],
    default: 'private',
  },
  position: {
    type: Number,
    default: 0,
  },
});

export const Lesson = models.Lesson ?? model('Lesson', lessonSchema);
