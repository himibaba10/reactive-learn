'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { auth } from '@/auth';
import { Assessment } from '@/models/assessment.model';
import { QuizSet } from '@/models/quizset.model';
import { Report } from '@/models/report.model';
import { revalidatePath } from 'next/cache';

export const submitQuizSet = async ({ quizSetId, answers, courseId }) => {
  try {
    const session = await auth();
  const userId = session?.user?.id;

  const quizSet = await QuizSet.findById(quizSetId)
    .populate('quizIds') // populate the quizIds array
    .lean();

  if (!quizSet) {
    return actionError('QuizSet not found');
  }

  const quizzes = quizSet.quizIds || []; // populated quizzes

  // Transform frontend answers to assessment format
  const assessments = quizzes.map((quiz) => ({
    quizId: quiz._id,
    options: quiz.options.map((option, index) => ({
      option: option.text,
      isCorrect: option.is_correct,
      isSelected: answers[quiz._id]?.includes(index) || false,
    })),
    attempted: !!answers[quiz._id]?.length,
  }));

  // Upsert assessment for this user/quizSet
  const assessment = await Assessment.findOneAndUpdate(
    { user: userId, quizSet: quizSetId },
    {
      assessments,
      otherMarks: 0,
      submittedAt: new Date(),
    },
    { upsert: true, new: true },
  );

  // Update Report
  await Report.findOneAndUpdate(
    { student: userId, course: courseId },
    { quizAssessment: assessment._id },
    { upsert: true },
  );

    revalidatePath('/courses');

    return actionSuccess(null);
  } catch (error) {
    return actionError(error);
  }
};
