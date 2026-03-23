import { model, models, Schema } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.Course;
}

const courseSchema = new Schema(
  {
    title: {
      required: true,
      type: String,
    },
    subtitle: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    thumbnail: String,
    modules: [{ type: Schema.ObjectId, ref: 'Module' }],
    price: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Schema.ObjectId,
      ref: 'Category',
    },
    learning: [String],
    instructor: {
      required: true,
      type: Schema.ObjectId,
      ref: 'User',
    },
    quizSet: {
      type: Schema.ObjectId,
      ref: 'QuizSet',
    },
    testimonials: [
      {
        type: Schema.ObjectId,
        ref: 'Testimonial',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Course = models.Course ?? model('Course', courseSchema);
