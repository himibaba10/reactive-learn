import { replaceMongoIdInObject } from '@/lib/convertDBData';
import { Assessment } from '@/models/assessment.model';
import { Course } from '@/models/course.model';
import { Report } from '@/models/report.model';
import { dbConnect } from '@/service/mongo';

export const getAReport = async ({ courseId, studentId }) => {
  await dbConnect();
  const report = await Report.findOne({
    course: courseId,
    student: studentId,
  })

    .populate({
      path: 'quizAssessment',
      model: Assessment,
    })
    .populate({
      path: 'course',
      model: Course,
    })
    .lean();

  const attemptedQuizzes = report?.quizAssessment?.assessments.filter(
    (quiz) => quiz.attempted,
  );

  const correctQuizzes = attemptedQuizzes?.filter((quiz) => {
    return quiz.options.every(
      (option) => option.isCorrect === option.isSelected,
    );
  });

  const quizMark = correctQuizzes?.length ? correctQuizzes?.length * 5 : 0;
  const otherMarks = report?.quizAssessment?.otherMarks ?? 0;
  const completedModules = report?.totalCompletedModules?.length ?? 0;

  const totalModules = report?.course?.modules?.length || 0;
  
  const moduleCompletionProgress = totalModules > 0
    ? Number(((completedModules / totalModules) * 100).toFixed(2))
    : 0;

  return {
    ...replaceMongoIdInObject(report),
    totalQuizzes: report?.quizAssessment?.assessments?.length ?? 0,
    attemptedQuizzes: attemptedQuizzes?.length ?? 0,
    quizMark,
    otherMarks,
    completedModules,
    moduleCompletionProgress,
  };
};
