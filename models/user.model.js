import { model, models, Schema } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.User;
}

const userSchema = new Schema(
  {
    firstName: {
      required: true,
      type: String,
    },
    lastName: {
      required: true,
      type: String,
    },
    designation: String,
    password: {
      required: true,
      type: String,
      select: false,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      lowercase: true,
    },
    phone: String,
    role: {
      type: String,
      enum: ['student', 'teacher'],
      default: 'student',
    },
    bio: String,
    socialMedia: {
      facebook: String,
      url: String,
    },
    profilePicture: String,
  },
  { timestamps: true },
);

export const User = models.User ?? model('User', userSchema);
