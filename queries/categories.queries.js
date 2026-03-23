'use server';

import { replaceMongoIdInArray } from '@/lib/convertDBData';
import { Category } from '@/models/category.model';

export const getCategories = async () => {
  const categories = await Category.find({}).lean();
  return replaceMongoIdInArray(categories);
};
