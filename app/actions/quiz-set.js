'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { slugify } from '@/lib/utils';
import { Quiz } from '@/models/quiz.model';
import { QuizSet } from '@/models/quizset.model';
import { revalidatePath } from 'next/cache';

export async function createQuizSet(data) {
  try {
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
    await QuizSet.findByIdAndUpdate(quizSetId, data);
    revalidatePath('/dashboard');
    return actionSuccess(null);
  } catch (error) {
    return actionError(error);
  }
};

export async function togglePublishQuizSet(quizSetId, currentStatus) {
  try {
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
    const quizSet = await QuizSet.findById(quizSetId);

    await Quiz.deleteMany({ _id: { $in: quizSet.quizIds } });
    await QuizSet.findByIdAndDelete(quizSetId);

    return actionSuccess(null);
  } catch (error) {
    console.error('deleteQuizSet error:', error);
    return actionError(error);
  }
}
