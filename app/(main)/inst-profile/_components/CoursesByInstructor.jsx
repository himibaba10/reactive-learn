import { SectionTitle } from '@/components/section-title';
import CourseCard from '../../courses/_components/CourseCard';

const CoursesByInstructor = ({ courses }) => {
  const activeCourses = courses?.filter((course) => course.active) || [];

  return (
    <div className='col-span-12 lg:col-span-8'>
      <div>
        <SectionTitle className='mb-6'>Courses</SectionTitle>
        {activeCourses.length > 0 ? (
          <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
            {activeCourses.map((course) => (
              <CourseCard key={course?._id} course={course} />
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center p-12 bg-muted/50 rounded-lg'>
            <p className='text-muted-foreground'>This instructor has no active courses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesByInstructor;
