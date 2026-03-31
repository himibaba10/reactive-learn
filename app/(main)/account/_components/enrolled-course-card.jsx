import { CourseProgress } from '@/components/course-progress';
import { Badge } from '@/components/ui/badge';
import { calculateModuleProgress } from '@/lib/module-helpers';
import { getAReport } from '@/queries/report.queries';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DownloadCertificate } from '../../courses/[id]/lesson/_components/download-certificate';

const EnrolledCourseCard = async ({ enrollment, studentId }) => {
  const course = enrollment?.course;
  const report = await getAReport({ courseId: course._id, studentId });
  const otherMarks = report?.quizAssessment?.otherMarks ?? 0;
  const quizMark = report?.quizMark ?? 0;
  const completedModules = report?.totalCompletedModules?.length ?? 0;
  const moduleCompletionProgress = calculateModuleProgress(completedModules, course?.modules?.length);

  return (
    <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
      <Link href={`/courses/${course._id}/lesson`}>
        <div className='relative w-full aspect-video rounded-md overflow-hidden'>
          <Image src={`/assets/images/courses/${course?.thumbnail}`} alt={course?.title} className='object-cover' fill />
        </div>
        <div className='flex flex-col pt-2'>
          <div className='text-lg md:text-base font-medium group-hover:text-sky-700 line-clamp-2'>{course?.title}</div>
          <p className='text-xs text-muted-foreground'>{course?.category?.title}</p>
          <div className='my-3 flex items-center gap-x-2 text-sm md:text-xs'>
            <div className='flex items-center gap-x-1 text-muted-foreground'>
              <div>
                <BookOpen className='w-4' />
              </div>
              <span>{course?.modules?.length} Chapters</span>
            </div>
          </div>
          <div className=' border-b pb-2 mb-2'>
            <div className='flex items-center justify-between'>
              <p className='text-md md:text-sm font-medium text-foreground'>Total Modules: {course?.modules?.length}</p>
              <div className='text-md md:text-sm font-medium text-foreground'>
                Completed Modules <Badge variant='success'>{completedModules}</Badge>
              </div>
            </div>
            <div className='flex items-center justify-between mt-2'>
              <p className='text-md md:text-sm font-medium text-foreground'>Total Quizzes: {report?.totalQuizzes ?? 0}</p>

              <div className='text-md md:text-sm font-medium text-foreground'>
                Quiz taken <Badge variant='success'>{report?.attemptedQuizzes}</Badge>
              </div>
            </div>
            <div className='flex items-center justify-between mt-2'>
              <p className='text-md md:text-sm font-medium text-foreground'>Mark from Quizzes</p>

              <p className='text-md md:text-sm font-medium text-foreground'>{quizMark}</p>
            </div>
            <div className='flex items-center justify-between mt-2'>
              <p className='text-md md:text-sm font-medium text-foreground'>Others</p>

              <p className='text-md md:text-sm font-medium text-foreground'>{otherMarks}</p>
            </div>
          </div>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-md md:text-sm font-medium text-foreground'>Total Marks</p>
            <p className='text-md md:text-sm font-medium text-foreground'>{quizMark + otherMarks}</p>
          </div>

          <CourseProgress size='sm' value={moduleCompletionProgress} variant={moduleCompletionProgress === 100 ? 'success' : ''} className='bg-red-300' />
        </div>
      </Link>
      {moduleCompletionProgress === 100 && <DownloadCertificate courseId={course._id} />}
    </div>
  );
};

export default EnrolledCourseCard;
