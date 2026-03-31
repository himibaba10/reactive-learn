'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { slugify } from '@/lib/utils';
import { Lesson } from '@/models/lesson.model';
import { Module } from '@/models/module.model';
import { dbConnect } from '@/service/mongo';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { Course } from '@/models/course.model';

export async function createLesson(moduleId, data) {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionError('Unauthorized', 401);

    await dbConnect();
    let slug = slugify(data.title, { lower: true });
    let uniqueSlug = slug;
    let count = 1;

    while (await Lesson.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    const mod = await Module.findById(moduleId).select('lessonIds course').lean();
    if (!mod) return actionError('Module not found', 404);

    const course = await Course.findById(mod.course).select('instructor').lean();
    if (course?.instructor?.toString() !== session.user.id) {
      return actionError('Forbidden', 403);
    }

    const lessonCount = mod?.lessonIds?.length ?? 0;

    const lesson = await Lesson.create({
      ...data,
      slug: uniqueSlug,
      module: moduleId,
      position: lessonCount,
    });

    await Module.findByIdAndUpdate(moduleId, {
      $push: { lessonIds: lesson._id },
    });

    return actionSuccess(JSON.parse(JSON.stringify(lesson)));
  } catch (error) {
    return actionError(error);
  }
}

export async function reorderLessons(bulkUpdateData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionError('Unauthorized', 401);

    await dbConnect();

    if (bulkUpdateData.length > 0) {
      const lessonId = bulkUpdateData[0].id;
      const mod = await Module.findOne({ lessonIds: lessonId }).select('course').lean();
      if (mod) {
        const course = await Course.findById(mod.course).select('instructor').lean();
        if (course?.instructor?.toString() !== session.user.id) {
          return actionError('Forbidden', 403);
        }
      }
    }

    await Promise.all(
      bulkUpdateData.map(({ id, position }) =>
        Lesson.findByIdAndUpdate(id, { position }),
      ),
    );
    return actionSuccess(null);
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteLesson(lessonId) {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionError('Unauthorized', 401);

    await dbConnect();

    const mod = await Module.findOne({ lessonIds: lessonId }).select('course').lean();
    if (mod) {
      const course = await Course.findById(mod.course).select('instructor').lean();
      if (course?.instructor?.toString() !== session.user.id) {
        return actionError('Forbidden', 403);
      }
    }

    await Module.findOneAndUpdate(
      { lessonIds: lessonId },
      { $pull: { lessonIds: lessonId } },
    );

    await Lesson.findByIdAndDelete(lessonId);

    revalidatePath('/dashboard/courses');
    return actionSuccess(null);
  } catch (error) {
    return actionError(error);
  }
}
