'use client';

import NavbarDropdown from '@/components/navbar-dropdown';
import useLoggedinUser from '@/hooks/use-loggedin-user';
import { MobileSidebar } from './mobile-sidebar';

export const Navbar = () => {
  const { loggedInUser } = useLoggedinUser();
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
      <MobileSidebar />
      <div className='flex items-center justify-end  w-full'>
        <NavbarDropdown loggedInUser={loggedInUser} />
      </div>
    </div>
  );
};
