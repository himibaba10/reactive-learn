'use server';

import { slugify } from '@/lib/utils';
import { Quiz } from '@/models/quiz.model';
import { QuizSet } from '@/models/quizset.model';
import { revalidatePath } from 'next/cache';

export async function updateQuiz(quizId, data) {
  try {
    await Quiz.findByIdAndUpdate(quizId, data);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createQuiz(quizSetId, quizData) {
  try {
    let slug = slugify(quizData.question);
    let uniqueSlug = slug;
    let count = 1;

    while (await Quiz.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    const quiz = await Quiz.create({
      ...quizData,
      slug: uniqueSlug,
    });

    await QuizSet.findByIdAndUpdate(quizSetId, {
      $push: { quizIds: quiz._id },
    });

    return { success: true };
  } catch (error) {
    console.error('createQuiz error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteQuiz(quizSetId, quizId) {
  try {
    await Quiz.findByIdAndDelete(quizId);

    await QuizSet.findByIdAndUpdate(quizSetId, {
      $pull: { quizIds: quizId },
    });

    return { success: true };
  } catch (error) {
    console.error('deleteQuiz error:', error);
    return { success: false, error: error.message };
  }
}
