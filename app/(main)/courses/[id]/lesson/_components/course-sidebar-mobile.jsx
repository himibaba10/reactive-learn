'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { SidebarSheetProvider } from './sidebar-sheet-context';

export const CourseSidebarMobile = ({ course, studentId, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className='lg:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-background w-72'>
        <SidebarSheetProvider onClose={() => setOpen(false)}>
          {children}
        </SidebarSheetProvider>
      </SheetContent>
    </Sheet>
  );
};
