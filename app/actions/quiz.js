'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { slugify } from '@/lib/utils';
import { Quiz } from '@/models/quiz.model';
import { QuizSet } from '@/models/quizset.model';
import { dbConnect } from '@/service/mongo';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function updateQuiz(quizId, data) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'instructor') {
      return actionError('Unauthorized', 401);
    }

    await dbConnect();
    await Quiz.findByIdAndUpdate(quizId, data);
    revalidatePath('/dashboard');
    return actionSuccess(null);
  } catch (error) {
    return actionError(error);
  }
}

export async function createQuiz(quizSetId, quizData) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'instructor') {
      return actionError('Unauthorized', 401);
    }

    await dbConnect();
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

    return actionSuccess(null);
  } catch (error) {
    console.error('createQuiz error:', error);
    return actionError(error);
  }
}

export async function deleteQuiz(quizSetId, quizId) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'instructor') {
      return actionError('Unauthorized', 401);
    }

    await dbConnect();
    await Quiz.findByIdAndDelete(quizId);

    await QuizSet.findByIdAndUpdate(quizSetId, {
      $pull: { quizIds: quizId },
    });

    return actionSuccess(null);
  } catch (error) {
    console.error('deleteQuiz error:', error);
    return actionError(error);
  }
}
