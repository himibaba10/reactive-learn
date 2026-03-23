import { model, models, Schema } from 'mongoose';

if (process.env.NODE_ENV === 'development') {
  delete models.Category;
}

const categorySchema = new Schema({
  title: {
    required: true,
    type: String,
  },

  description: String,

  thumbnail: {
    required: true,
    type: String,
  },
});

export const Category = models.Category ?? model('Category', categorySchema);
