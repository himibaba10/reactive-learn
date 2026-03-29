'use client';

import NavbarDropdown from '@/components/navbar-dropdown';
import useLoggedinUser from '@/hooks/use-loggedin-user';
import { MobileSidebar } from './mobile-sidebar';
import { ModeToggle } from '@/components/mode-toggle';

export const Navbar = () => {
  const { loggedInUser } = useLoggedinUser();
  return (
    <div className='p-4 border-b h-full flex items-center bg-background shadow-sm'>
      <MobileSidebar />
      <div className='flex items-center justify-end w-full gap-4'>
        <ModeToggle />
        <NavbarDropdown loggedInUser={loggedInUser} />
      </div>
    </div>
  );
};
