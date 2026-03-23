'use server';

import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from '@/lib/convertDBData';
import { slugify } from '@/lib/utils';
import { Course } from '@/models/course.model';
import { Module } from '@/models/module.model';
import { redirect } from 'next/navigation';

export const getModulesForCourse = async (courseId) => {
  const modules = await Module.find({ course: courseId })
    .sort({ position: 1 })
    .lean();
  return replaceMongoIdInArray(modules);
};

export const createModuleToDB = async (courseId, data) => {
  let slug = slugify(data.title);
  let uniqueSlug = slug;
  let count = 1;

  while (await Module.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  const moduleCount = await Module.countDocuments({ course: courseId });

  const result = await Module.create({
    ...data,
    slug: uniqueSlug,
    position: moduleCount,
    course: courseId,
  });

  await Course.findByIdAndUpdate(courseId, {
    $push: { modules: result?._id },
  });

  return replaceMongoIdInObject(result.toObject());
};

export const getModuleById = async (moduleId) => {
  const mod = await Module.findById(moduleId).lean();

  if (!mod) redirect('/');

  return replaceMongoIdInObject(mod);
};

export const updateModule = async (moduleId, data) => {
  await Module.findByIdAndUpdate(moduleId, data);
};
