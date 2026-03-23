import { model, models, Schema } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.QuizSet;
}

const quizSetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    mark: {
      type: Number,
      min: 0,
      default: 0,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'draft',
    },
    quizIds: [
      {
        type: Schema.ObjectId,
        ref: 'Quiz',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const QuizSet = models.QuizSet ?? model('QuizSet', quizSetSchema);
