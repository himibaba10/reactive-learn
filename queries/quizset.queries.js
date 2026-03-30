'use server';

import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from '@/lib/convertDBData';
import { QuizSet } from '@/models/quizset.model';
import { dbConnect } from '@/service/mongo';
import { redirect } from 'next/navigation';

export const getQuizSets = async ({ filters = {} } = {}) => {
  await dbConnect();
  const quizsets = await QuizSet.find(filters).lean();
  return replaceMongoIdInArray(
    quizsets.map((quizset) => ({
      ...quizset,
      totalQuiz: quizset?.quizIds?.length,
    })),
  );
};

export const getQuizSetById = async (quizSetId) => {
  await dbConnect();
  const quizset = await QuizSet.findById(quizSetId).lean();

  if (!quizset) return redirect('/dashboard/quiz-sets');

  return replaceMongoIdInObject(quizset);
};
