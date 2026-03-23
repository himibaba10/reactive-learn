import { Schema, model, models } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.Assessment;
}

const assessmentSchema = new Schema(
  {
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    quizSet: { type: Schema.ObjectId, ref: 'QuizSet', required: true },

    assessments: [
      {
        quizId: { type: Schema.ObjectId, ref: 'Quiz', required: true },
        options: [
          {
            option: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
            isSelected: { type: Boolean, required: true },
          },
        ],
        attempted: { type: Boolean, default: false },
      },
    ],

    otherMarks: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Assessment =
  models.Assessment ?? model('Assessment', assessmentSchema);
