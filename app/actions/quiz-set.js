'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { replaceMongoIdInObject } from '@/lib/convertDBData';
import { slugify } from '@/lib/utils';
import { Quiz } from '@/models/quiz.model';
import { QuizSet } from '@/models/quizset.model';
import { dbConnect } from '@/service/mongo';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function createQuizSet(data) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'instructor') {
      return actionError('Unauthorized', 401);
    }

    await dbConnect();
    let slug = slugify(data.title);
    let uniqueSlug = slug;
    let count = 1;

    while (await QuizSet.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    const quizSet = await QuizSet.create({
      title: data.title,
      slug: uniqueSlug,
    });

    return actionSuccess(replaceMongoIdInObject(quizSet.toObject()));
  } catch (error) {
    console.error('createQuizSet error:', error);
    return actionError(error);
  }
}

export const updateQuizSet = async (quizSetId, data) => {
  try {
    const session = await auth();
    if (session?.user?.role !== 'instructor') {
      return actionError('Unauthorized', 401);
    }

    await dbConnect();
    await QuizSet.findByIdAndUpdate(quizSetId, data);
    revalidatePath('/dashboard');
    return actionSuccess(null);
  } catch (error) {
    return actionError(error);
  }
};

export async function togglePublishQuizSet(quizSetId, currentStatus) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'instructor') {
      return actionError('Unauthorized', 401);
    }

    await dbConnect();
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';

    await QuizSet.findByIdAndUpdate(quizSetId, { status: newStatus });

    revalidatePath(`/dashboard/quiz-sets/${quizSetId}`);
    return actionSuccess({ status: newStatus });
  } catch (error) {
    console.error('togglePublishQuizSet error:', error);
    return actionError(error);
  }
}

export async function deleteQuizSet(quizSetId) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'instructor') {
      return actionError('Unauthorized', 401);
    }

    await dbConnect();
    const quizSet = await QuizSet.findById(quizSetId);

    if (!quizSet) {
      throw new Error('Quiz set not found.');
    }

    await Quiz.deleteMany({ _id: { $in: quizSet.quizIds } });
    await QuizSet.findByIdAndDelete(quizSetId);

    return actionSuccess(null);
  } catch (error) {
    console.error('deleteQuizSet error:', error);
    return actionError(error);
  }
}

