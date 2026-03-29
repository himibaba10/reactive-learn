'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { replaceMongoIdInObject } from '@/lib/convertDBData';
import { Course } from '@/models/course.model';
import { Lesson } from '@/models/lesson.model';
import { Module } from '@/models/module.model';
import { createModuleToDB } from '@/queries/module.queries';
import { revalidatePath } from 'next/cache';

export async function reorderModules(bulkUpdateData) {
  try {
    await Promise.all(
      bulkUpdateData.map(({ id, position }) =>
        Module.findByIdAndUpdate(id, { position }),
      ),
    );

    return actionSuccess(null);
  } catch (error) {
    return actionError(error);
  }
}

export const createModule = async (courseId, data) => {
  try {
    const result = await createModuleToDB(courseId, data);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
};

export const togglePublishModule = async (moduleId) => {
  try {
    const mod = await Module.findById(moduleId).select('status').lean();

    const updatedModule = await Module.findByIdAndUpdate(
      moduleId,
      {
        status: mod.status === 'active' ? 'inactive' : 'active',
      },
      {
        returnDocument: 'after',
      },
    ).lean();

    revalidatePath('/dashboard/courses');

    return actionSuccess(replaceMongoIdInObject(updatedModule));
  } catch (error) {
    return actionError(error);
  }
};

export async function deleteModule(moduleId) {
  try {
    const mod = await Module.findById(moduleId).select('lessonIds').lean();

    if (mod?.lessonIds?.length) {
      await Lesson.deleteMany({ _id: { $in: mod.lessonIds } });
    }

    await Course.findOneAndUpdate(
      { modules: moduleId },
      { $pull: { modules: moduleId } },
    );

    await Module.findByIdAndDelete(moduleId);

    revalidatePath('/dashboard/courses');
    return actionSuccess(null);
  } catch (error) {
    return actionError(error);
  }
}
