import { auth } from '@/auth';
import { getCourseDetails } from '@/queries/courses.queries';
import { hasEnrollmentForCourse } from '@/queries/enrollment.queries';
import { redirect } from 'next/navigation';
import { CourseSidebar } from './_components/course-sidebar';
import { CourseSidebarMobile } from './_components/course-sidebar-mobile';

const CourseLayout = async ({ children, params: { id } }) => {
  const session = await auth();
  const loggedinUser = session?.user;

  if (!loggedinUser) {
    redirect('/login');
  }

  const isEnrolled = await hasEnrollmentForCourse(id, loggedinUser.id);

  if (!isEnrolled) {
    redirect('/courses');
  }

  const course = await getCourseDetails(id);

  return (
    <div className=''>
      <div className='h-[80px] lg:pl-96 fixed top-[60px] inset-y-0 w-full z-10'>
        <div className='flex lg:hidden p-4 border-b h-full items-center bg-background shadow-sm relative'>
          {/* Course Sidebar For Mobile */}
          <CourseSidebarMobile course={course} studentId={loggedinUser.id} />
          {/* <NavbarRoutes /> */}
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-12'>
        <div className='hidden lg:flex h-full w-96 flex-col inset-y-0 z-50'>
          {/* sidebar starts */}
          <CourseSidebar course={course} studentId={loggedinUser.id} />
          {/* sidebar ends */}
        </div>
        <main className='lg:pl-96 pt-[80px] lg:pt-[20px] h-full col-span-10 px-4'>
          {children}
        </main>
      </div>
    </div>
  );
};
export default CourseLayout;
