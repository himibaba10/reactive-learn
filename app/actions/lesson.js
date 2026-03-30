'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { slugify } from '@/lib/utils';
import { Lesson } from '@/models/lesson.model';
import { Module } from '@/models/module.model';
import { dbConnect } from '@/service/mongo';
import { revalidatePath } from 'next/cache';

export async function createLesson(moduleId, data) {
  try {
    await dbConnect();
    let slug = slugify(data.title, { lower: true });
    let uniqueSlug = slug;
    let count = 1;

    while (await Lesson.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    const mod = await Module.findById(moduleId).select('lessonIds').lean();
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
    await dbConnect();
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
    await dbConnect();
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
