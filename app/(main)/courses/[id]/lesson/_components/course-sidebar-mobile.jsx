import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { Menu } from 'lucide-react';
import { CourseSidebar } from './course-sidebar';

export const CourseSidebarMobile = ({ course, studentId }) => {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-background w-72'>
        <CourseSidebar course={course} studentId={studentId} />
      </SheetContent>
    </Sheet>
  );
};
