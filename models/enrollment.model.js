import { Schema, model, models } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.Enrollment;
}

const enrollmentSchema = new Schema(
  {
    enrollmentDate: {
      required: true,
      type: Date,
    },

    status: {
      required: true,
      type: String,
    },

    completionDate: Date,

    method: {
      required: true,
      type: String,
    },

    course: { type: Schema.ObjectId, ref: 'Course' },

    student: { type: Schema.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

export const Enrollment =
  models.Enrollment ?? model('Enrollment', enrollmentSchema);
