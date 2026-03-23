import { AccordionContent } from '@/components/ui/accordion';
import { SidebarLessonItem } from './sidebar-lesson-items';

export const SidebarLessons = ({
  lessons,
  completedLessons,
  activeLessonSlug,
  courseId,
  moduleId,
}) => {
  return (
    <AccordionContent>
      <div className='flex flex-col w-full gap-1'>
        {lessons
          ?.sort((a, b) => a?.position - b?.position)
          ?.map((lesson) => {
            return (
              <SidebarLessonItem
                key={lesson?._id}
                lesson={lesson}
                courseId={courseId}
                isActive={activeLessonSlug === lesson?.slug}
                isCompleted={completedLessons?.includes(lesson._id?.toString())}
                moduleId={moduleId}
              />
            );
          })}
      </div>
    </AccordionContent>
  );
};
