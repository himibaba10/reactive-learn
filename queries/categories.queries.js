'use server';

import { replaceMongoIdInArray } from '@/lib/convertDBData';
import { Category } from '@/models/category.model';
import { dbConnect } from '@/service/mongo';

export const getCategories = async () => {
  await dbConnect();
  const categories = await Category.find({}).lean();
  return replaceMongoIdInArray(categories);
};

