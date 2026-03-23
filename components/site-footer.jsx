import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Logo } from './logo';

export function SiteFooter({ className }) {
  return (
    <footer className={cn(className)}>
      <div className='container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0'>
        <div className='w-full flex flex-col justify-between items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0'>
          <Logo />
          <p className='text-center text-sm leading-loose md:text-left'>
            Reactive Learn © {new Date().getFullYear()} - Created By{' '}
            <Link
              href='http://reactiveferdous.com'
              target='_blank'
              className='underline'
            >
              Reactive Ferdous
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
