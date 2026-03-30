'use server';

import { replaceMongoIdInArray } from '@/lib/convertDBData';
import { Quiz } from '@/models/quiz.model';
import { QuizSet } from '@/models/quizset.model';
import { dbConnect } from '@/service/mongo';

export const getQuizzesFromQuizSet = async (quizSetId) => {
  await dbConnect();
  const quizSet = await QuizSet.findById(quizSetId);
  const quizzes = await Quiz.find({ _id: { $in: quizSet?.quizIds } }).lean();

  return replaceMongoIdInArray(quizzes);
};

