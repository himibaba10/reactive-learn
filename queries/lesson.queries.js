'use server';

import { replaceMongoIdInObject } from '@/lib/convertDBData';
import { Lesson } from '@/models/lesson.model';
import { Module } from '@/models/module.model';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const getLesson = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) return redirect('/');
  return replaceMongoIdInObject(lesson);
};

export const getLessonsByModuleId = async (moduleId) => {
  const mod = await Module.findById(moduleId).lean();
  if (!mod || !mod.lessonIds?.length) return [];

  const lessons = await Lesson.find({ _id: { $in: mod.lessonIds } })
    .sort({ position: 1 })
    .lean();

  return lessons.map((lesson) => ({
    ...lesson,
    _id: lesson._id.toString(),
  }));
};

export const updateLesson = async (lessonId, data) => {
  await Lesson.findByIdAndUpdate(lessonId, data);
  revalidatePath('/dashboard/courses');
};

export const togglePublishLesson = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId).select('published').lean();

  await Lesson.findByIdAndUpdate(lessonId, {
    published: !lesson.published,
  });
};

export async function getLessonBySlug(slug) {
  const lesson = await Lesson.findOne({ slug }).lean();
  return replaceMongoIdInObject(lesson);
}
