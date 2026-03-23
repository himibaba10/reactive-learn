'use client';

import { MobileNav } from '@/components/mobile-nav';
import useLoggedinUser from '@/hooks/use-loggedin-user';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Logo } from './logo';
import NavbarDropdown from './navbar-dropdown';
import { Button, buttonVariants } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
export function MainNav({ items, children }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { loggedInUser } = useLoggedinUser();

  return (
    <>
      <div className='flex gap-6 lg:gap-10'>
        <Logo />
        {items?.length ? (
          <nav className='hidden gap-6 lg:flex'>
            {items?.map((item, index) => (
              <Link
                key={index}
                href={item.disabled ? '#' : item.href}
                className={cn(
                  'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}

        {showMobileMenu && items && (
          <MobileNav items={items}>{children}</MobileNav>
        )}
      </div>
      <nav className='flex items-center gap-3'>
        <div className='items-center gap-3 hidden lg:flex'>
          {!loggedInUser && (
            <>
              <Link
                href='/login'
                className={cn(buttonVariants({ size: 'sm' }), 'px-4')}
              >
                Login
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm'>
                    Register
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56 mt-4'>
                  <DropdownMenuItem className='cursor-pointer'>
                    <Link href='/register/student'>Student</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer'>
                    <Link href='/register/instructor'>Instructor</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
        {loggedInUser && <NavbarDropdown loggedInUser={loggedInUser} />}
        <button
          className='flex items-center space-x-2 lg:hidden'
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X /> : <Menu />}
        </button>
      </nav>
    </>
  );
}
