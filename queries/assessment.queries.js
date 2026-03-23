import { auth } from '@/auth';
import { replaceMongoIdInObject } from '@/lib/convertDBData';
import { Assessment } from '@/models/assessment.model';

export const getUserAssessment = async ({ quizSetId, courseId }) => {
  const session = await auth();
  const userId = session?.user?.id;

  const assessment = await Assessment.findOne({
    user: userId,
    quizSet: quizSetId,
  }).lean();

  return replaceMongoIdInObject(assessment);
};
