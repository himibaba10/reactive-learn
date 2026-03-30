import { auth } from '@/auth';
import { replaceMongoIdInObject } from '@/lib/convertDBData';
import { Assessment } from '@/models/assessment.model';
import { dbConnect } from '@/service/mongo';

export const getUserAssessment = async ({ quizSetId, courseId }) => {
  await dbConnect();
  const session = await auth();
  const userId = session?.user?.id;

  const assessment = await Assessment.findOne({
    user: userId,
    quizSet: quizSetId,
  }).lean();

  return replaceMongoIdInObject(assessment);
};

