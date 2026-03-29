import { MainNav } from '@/components/main-nav';
import { SiteFooter } from '@/components/site-footer';

const navLinks = [
  {
    title: 'Courses',
    href: '/courses',
  },
  {
    title: 'My Learning',
    href: '/account/enrolled-courses',
  },
  {
    title: 'My Profile',
    href: '/account',
  },
];

const MainLayout = ({ children }) => {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='bg-background/95 backdrop-blur-md sticky top-0 left-0 right-0 border-b shadow-sm z-[100] transition-all duration-300'>
        <div className='container flex h-20 items-center justify-between py-6 '>
          <MainNav items={navLinks} />
        </div>
      </header>
      <main className='flex-1 flex flex-col'>{children}</main>
      <SiteFooter />
    </div>
  );
};
export default MainLayout;
