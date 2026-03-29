import { SectionTitle } from '@/components/section-title';
import { getCourseList } from '@/queries/courses.queries';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import CourseCard from '../courses/_components/CourseCard';

const HomeCourses = async () => {
  let courses = await getCourseList({
    filter: { active: true },
    queries: { limit: 4 },
  });

  return (
    <section id='courses' className='container space-y-6   md:py-12 lg:py-24'>
      <div className='flex items-center justify-between'>
        <SectionTitle>Courses</SectionTitle>
        <Link
          href='/courses'
          className=' text-sm font-medium  hover:opacity-80 flex items-center gap-1'
        >
          Browse All <ArrowRightIcon className='h-4 w-4' />
        </Link>
      </div>
      {courses && courses.length > 0 ? (
        <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4'>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center p-12 bg-muted/50 rounded-lg'>
          <p className='text-muted-foreground'>No courses have been added yet.</p>
        </div>
      )}
    </section>
  );
};

export default HomeCourses;
