'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { replaceMongoIdInObject } from '@/lib/convertDBData';
import { Course } from '@/models/course.model';
import { Lesson } from '@/models/lesson.model';
import { Module } from '@/models/module.model';
import { createModuleToDB } from '@/queries/module.queries';
import { dbConnect } from '@/service/mongo';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function reorderModules(bulkUpdateData) {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionError('Unauthorized', 401);

    await dbConnect();
    
    if (bulkUpdateData.length > 0) {
      const mod = await Module.findById(bulkUpdateData[0].id).select('course').lean();
      if (mod) {
        const course = await Course.findById(mod.course).select('instructor').lean();
        if (course?.instructor?.toString() !== session.user.id) {
          return actionError('Forbidden', 403);
        }
      }
    }

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
    const session = await auth();
    if (!session?.user?.id) return actionError('Unauthorized', 401);

    await dbConnect();
    
    const course = await Course.findById(courseId).select('instructor').lean();
    if (course?.instructor?.toString() !== session.user.id) {
      return actionError('Forbidden', 403);
    }

    const result = await createModuleToDB(courseId, data);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
};

export const togglePublishModule = async (moduleId) => {
  try {
    const session = await auth();
    if (!session?.user?.id) return actionError('Unauthorized', 401);

    await dbConnect();
    const mod = await Module.findById(moduleId).select('status course').lean();
    if (!mod) return actionError('Module not found', 404);

    const course = await Course.findById(mod.course).select('instructor').lean();
    if (course?.instructor?.toString() !== session.user.id) {
      return actionError('Forbidden', 403);
    }


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
    const session = await auth();
    if (!session?.user?.id) return actionError('Unauthorized', 401);

    await dbConnect();
    const mod = await Module.findById(moduleId).select('lessonIds course').lean();
    if (!mod) return actionError('Module not found', 404);

    const course = await Course.findById(mod.course).select('instructor').lean();
    if (course?.instructor?.toString() !== session.user.id) {
      return actionError('Forbidden', 403);
    }


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
