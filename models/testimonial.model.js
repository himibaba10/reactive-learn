import { model, models, Schema } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.Testimonial;
}

const testimonialSchema = new Schema({
  content: {
    required: true,
    type: String,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  courseId: {
    type: Schema.ObjectId,
    ref: 'Course',
  },
  rating: {
    required: true,
    type: Number,
  },
});

export const Testimonial =
  models.Testimonial ?? model('Testimonial', testimonialSchema);
