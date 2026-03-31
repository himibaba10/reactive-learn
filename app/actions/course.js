'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { replaceMongoIdInObject } from '@/lib/convertDBData';
import { Course } from '@/models/course.model';
import { Lesson } from '@/models/lesson.model';
import { Module } from '@/models/module.model';
import { dbConnect } from '@/service/mongo';
import { revalidatePath } from 'next/cache';
import { deleteCourseImage } from './course-image';
import { auth } from '@/auth';

export const togglePublishCourse = async (courseId) => {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionError('Unauthorized', 401);

    await dbConnect();
    const course = await Course.findById(courseId).select('active instructor').lean();

    if (course?.instructor?.toString() !== session.user.id) {
      return actionError('Forbidden', 403);
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        active: !course?.active,
      },
      {
        returnDocument: 'after',
      },
    ).lean();

    revalidatePath('/dashboard/courses');

    return actionSuccess(replaceMongoIdInObject(updatedCourse));
  } catch (error) {
    return actionError(error);
  }
};

export async function deleteCourse(courseId) {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionError('Unauthorized', 401);

    await dbConnect();
    const course = await Course.findById(courseId).select('modules instructor').lean();

    if (course?.instructor?.toString() !== session.user.id) {
      return actionError('Forbidden', 403);
    }

    if (course?.modules?.length) {
      const modules = await Module.find(
        { _id: { $in: course.modules } },
        { lessonIds: 1 },
      ).lean();

      const allLessonIds = modules.flatMap((mod) => mod.lessonIds ?? []);
      if (allLessonIds.length) {
        await Lesson.deleteMany({ _id: { $in: allLessonIds } });
      }

      await Module.deleteMany({ _id: { $in: course.modules } });
    }

    await deleteCourseImage(course?.thumbnail);
    await Course.findByIdAndDelete(courseId);

    revalidatePath('/dashboard/courses');
    return actionSuccess(null);
  } catch (error) {
    return actionError(error);
  }
}

export async function updateCourseQuizSet(courseId, quizSetId) {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionError('Unauthorized', 401);

    await dbConnect();

    const course = await Course.findById(courseId).select('instructor').lean();
    if (course?.instructor?.toString() !== session.user.id) {
      return actionError('Forbidden', 403);
    }

    await Course.findByIdAndUpdate(courseId, { quizSet: quizSetId });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return actionSuccess(null);
  } catch (error) {
    console.error('updateCourseQuizSet error:', error);
    return actionError(error);
  }
}
