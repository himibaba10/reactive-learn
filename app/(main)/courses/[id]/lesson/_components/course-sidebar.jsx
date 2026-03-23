import { CourseProgress } from '@/components/course-progress';
import { calculateModuleProgress } from '@/lib/module-helpers';
import { getUserAssessment } from '@/queries/assessment.queries';
import { getQuizzesFromQuizSet } from '@/queries/quiz.queries';
import { getAReport } from '@/queries/report.queries';
import { getTestimonialByUser } from '@/queries/review.queries';
import { getCompletedLessons } from '@/queries/watch.queries';
import { DownloadCertificate } from './download-certificate';
import { GiveReview } from './give-review';
import QuizModal from './quiz-modal';
import { SidebarModules } from './sidebar-modules';

export const CourseSidebar = async ({ course, studentId }) => {
  const report = await getAReport({ courseId: course?._id, studentId });
  const completedLessons = await getCompletedLessons(studentId, course?._id);
  const existingReview = await getTestimonialByUser({
    courseId: course?._id,
    studentId,
  });

  const completedModules = report?.totalCompletedModules?.length ?? 0;
  const moduleCompletionProgress = calculateModuleProgress(
    completedModules,
    course?.modules?.length,
  );

  const isCourseCompleted = report?.courseStatus === 'completed';

  const quizSet = course?.quizSet;
  const quizzes = await getQuizzesFromQuizSet(quizSet?._id);

  const userAssessment = await getUserAssessment({
    quizSetId: quizSet?._id,
    courseId: course?._id,
  });

  return (
    <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
      <div className='p-8 flex flex-col border-b'>
        <h1 className='font-semibold'>{course?.title}</h1>
        <div className='mt-10'>
          <CourseProgress variant='success' value={moduleCompletionProgress} />
        </div>
      </div>

      <SidebarModules
        modules={course?.modules}
        courseId={course?._id}
        completedLessons={completedLessons}
      />

      <div className='w-full px-6'>
        {isCourseCompleted && <DownloadCertificate courseId={course?._id} />}
        <GiveReview courseId={course?._id} hasReviewed={!!existingReview} />
      </div>
      <div className='flex justify-center my-5'>
        <QuizModal
          quizSet={quizSet}
          quizzes={quizzes}
          courseId={course?._id}
          userAssessment={userAssessment}
        />
      </div>
    </div>
  );
};
