import { model, models, Schema } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.Quiz;
}

const optionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  is_correct: {
    type: Boolean,
    required: true,
  },
});

const quizSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    options: [optionSchema],
    explanations: {
      type: String,
      required: true,
    },
    mark: {
      type: Number,
      required: true,
      min: 0,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Quiz = models.Quiz ?? model('Quiz', quizSchema);
