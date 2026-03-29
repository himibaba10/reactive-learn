import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { NotepadText, Video } from 'lucide-react';
import ModuleLessonList from './ModuleLessonList';

const CourseModuleList = ({ module }) => {
  let moduleDuration = 0;
  module?.lessonIds?.forEach((lesson) => {
    moduleDuration = moduleDuration + (lesson?.duration || 0);
  });

  return (
    <AccordionItem className='border-none' value='item-1'>
      <AccordionTrigger>{module?.title}</AccordionTrigger>
      <AccordionContent>
        {/* header */}
        <div className='flex gap-x-5 items-center flex-wrap mt-4 mb-6 text-muted-foreground text-sm'>
          <span className='flex items-center gap-1.5'>
            <Video className='w-4 h-4' />
            {((moduleDuration || 0) / 3600).toPrecision(2)} Hours
          </span>
          <span className='flex items-center gap-1.5'>
            <NotepadText className='w-4 h-4' />
            {module?.lessonIds?.length || 0} Lessons
          </span>
        </div>
        {/* header ends */}

        <div className='space-y-3'>
          {module?.lessonIds?.map((lessonId) => (
            <ModuleLessonList key={lessonId} lessonId={lessonId} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CourseModuleList;
