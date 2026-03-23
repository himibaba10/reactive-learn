import { model, models, Schema } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.Watch;
}

const watchSchema = new Schema(
  {
    state: {
      type: String,
      enum: ['started', 'completed'],
      default: 'started',
    },
    lesson: { type: Schema.ObjectId, ref: 'Lesson' },
    user: { type: Schema.ObjectId, ref: 'User' },
    module: { type: Schema.ObjectId, ref: 'Module' },
    course: { type: Schema.ObjectId, ref: 'Course' },
    lastTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
watchSchema.index({ user: 1, lesson: 1 }, { unique: true });

export const Watch = models.Watch ?? model('Watch', watchSchema);
