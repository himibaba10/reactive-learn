'use server';

import { replaceMongoIdInObject } from '@/lib/convertDBData';
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

    return {
      success: true,
      data: replaceMongoIdInObject(quizSet.toObject()),
    };
  } catch (error) {
    console.error('createQuizSet error:', error);
    return { success: false, error: error.message };
  }
}

export const updateQuizSet = async (quizSetId, data) => {
  try {
    await QuizSet.findByIdAndUpdate(quizSetId, data);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export async function togglePublishQuizSet(quizSetId, currentStatus) {
  try {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';

    await QuizSet.findByIdAndUpdate(quizSetId, { status: newStatus });

    revalidatePath(`/dashboard/quiz-sets/${quizSetId}`);
    return { success: true, status: newStatus };
  } catch (error) {
    console.error('togglePublishQuizSet error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteQuizSet(quizSetId) {
  try {
    const quizSet = await QuizSet.findById(quizSetId);

    await Quiz.deleteMany({ _id: { $in: quizSet.quizIds } });
    await QuizSet.findByIdAndDelete(quizSetId);

    return { success: true };
  } catch (error) {
    console.error('deleteQuizSet error:', error);
    return { success: false, error: error.message };
  }
}
