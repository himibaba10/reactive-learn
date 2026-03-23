'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useSearchParams } from 'next/navigation';
import { SidebarLessons } from './sidebar-lessons';

export const SidebarModules = ({ modules, completedLessons, courseId }) => {
  const params = useSearchParams();

  const defaultModuleId = params.get('module') ?? modules?.[0]?._id?.toString();
  const sortedModules = modules?.toSorted((a, b) => a.position - b.position);
  const activeLessonSlug =
    params.get('name') ??
    sortedModules[0]?.lessonIds?.sort((a, b) => a.position - b.position)[0]
      ?.slug;

  return (
    <Accordion
      defaultValue={defaultModuleId}
      type='single'
      collapsible
      className='w-full px-6'
    >
      {sortedModules?.map((module) => (
        <AccordionItem
          key={module._id}
          className='border-0'
          value={module._id.toString()}
        >
          <AccordionTrigger>{module.title}</AccordionTrigger>
          <SidebarLessons
            lessons={module.lessonIds}
            courseId={courseId}
            activeLessonSlug={activeLessonSlug}
            completedLessons={completedLessons}
            moduleId={module._id}
          />
        </AccordionItem>
      ))}
    </Accordion>
  );
};
