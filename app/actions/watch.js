'use server';

import { auth } from '@/auth';
import { getLoggedInUser } from '@/lib/my-helpers';
import { Lesson } from '@/models/lesson.model';
import { Module } from '@/models/module.model';
import { Report } from '@/models/report.model';
import { Watch } from '@/models/watch.model';
import { getModuleById } from '@/queries/module.queries';
import { revalidatePath } from 'next/cache';

export const startWatch = async ({ lessonId, moduleId, courseId }) => {
  const session = await auth();
  const userId = session?.user?.id;
  await Watch.findOneAndUpdate(
    { lesson: lessonId, user: userId, course: courseId, module: moduleId },
    {
      $setOnInsert: {
        lesson: lessonId,
        user: userId,
        module: moduleId,
        course: courseId,
        state: 'started',
      },
    },
    { upsert: true, returnDocument: 'after' },
  );
};

export const completeWatch = async ({ lessonId, courseId, moduleId }) => {
  const loggedInUser = await getLoggedInUser();

  // Step 1: mark watch as completed
  await Watch.findOneAndUpdate(
    {
      lesson: lessonId,
      user: loggedInUser.id,
      course: courseId,
      module: moduleId,
    },
    { state: 'completed' },
  );

  // Step 3: add lesson to report's totalCompletedLessons
  await Report.findOneAndUpdate(
    { student: loggedInUser.id, course: courseId },
    { $addToSet: { totalCompletedLessons: lessonId } },
    { upsert: true },
  );

  const parentModule = await getModuleById(moduleId);

  // Step 4: check if all published lessons in this module are completed
  const publishedLessonIds = await Lesson.find(
    { _id: { $in: parentModule.lessonIds }, published: true },
    { _id: 1 },
  ).then((lessons) => lessons.map((l) => l._id));

  const completedCount = await Watch.countDocuments({
    user: loggedInUser.id,
    lesson: { $in: publishedLessonIds },
    state: 'completed',
  });

  // Step 5: if all published lessons done, mark module as completed
  if (completedCount === publishedLessonIds.length) {
    await Report.findOneAndUpdate(
      { student: loggedInUser.id, course: courseId },
      { $addToSet: { totalCompletedModules: moduleId } },
    );

    // Step 6: check if all active modules in the course are completed
    const allActiveModules = await Module.find(
      { course: courseId, status: 'active' },
      { _id: 1 },
    );

    const report = await Report.findOne({
      student: loggedInUser.id,
      course: courseId,
    });

    const allModulesDone = allActiveModules.every((m) =>
      report.totalCompletedModules.some((id) => id === m._id.toString()),
    );

    // Step 7: if all modules done, mark course as completed
    if (allModulesDone) {
      await Report.findOneAndUpdate(
        { student: loggedInUser.id, course: courseId },
        { courseStatus: 'completed', completionDate: new Date() },
      );
    }
  }

  revalidatePath('/courses');
};
