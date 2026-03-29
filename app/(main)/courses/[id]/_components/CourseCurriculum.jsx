import { Accordion } from '@/components/ui/accordion';
import { BookCheck, Clock10 } from 'lucide-react';
import CourseModuleList from './CourseModuleList';

const CourseCurriculum = ({ course }) => {
  let totalDuration = 0;

  course?.modules?.forEach((module) => {
    module?.lessonIds?.forEach((lesson) => {
      totalDuration += lesson?.duration || 0;
    });
  });

  return (
    <>
      <div className='flex gap-x-5 items-center justify-center flex-wrap mt-4 mb-6 text-gray-600 text-sm'>
        <span className='flex items-center gap-1.5'>
          <BookCheck className='w-4 h-4' />
          {course?.modules?.length || 0} Chapters
        </span>
        <span className='flex items-center gap-1.5'>
          <Clock10 className='w-4 h-4' />
          {((totalDuration || 0) / 3600).toPrecision(2)} Hours
        </span>
      </div>

      <Accordion defaultValue={['item-1', 'item-2', 'item-3']} type='multiple' collapsible='true' className='w-full'>
        {course?.modules?.map((module) => (
          <CourseModuleList key={module._id} module={module} />
        ))}
      </Accordion>
    </>
  );
};

export default CourseCurriculum;
