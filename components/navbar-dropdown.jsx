import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const NavbarDropdown = ({ loggedInUser }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='cursor-pointer'>
          <Avatar>
            <AvatarImage src={loggedInUser?.profilePicture} alt={`${loggedInUser?.firstName} ${loggedInUser?.lastName}`} />
            <AvatarFallback>
              {loggedInUser?.firstName?.charAt(0)}
              {loggedInUser?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56 mt-4'>
        <DropdownMenuItem className='cursor-pointer' asChild>
          {loggedInUser?.role === 'student' ? <Link href='/account/enrolled-courses'>My Courses</Link> : <Link href='/dashboard'>Dashboard</Link>}
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' asChild>
          <Link href=''>My Certificates</Link>
        </DropdownMenuItem>
        {loggedInUser && (
          <DropdownMenuItem className='cursor-pointer' asChild>
            <button className='w-full' onClick={() => signOut({ redirectTo: '/' })}>
              Logout
            </button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarDropdown;
