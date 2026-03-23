import { SectionTitle } from '@/components/section-title';
import CourseCard from '../../courses/_components/CourseCard';

const CoursesByInstructor = ({ courses }) => {
  return (
    <div className='col-span-12 lg:col-span-8'>
      <div>
        <SectionTitle className='mb-6'>Courses</SectionTitle>
        <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
          {courses
            .filter((course) => course.active)
            .map((course) => {
              return <CourseCard key={course?._id} course={course} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default CoursesByInstructor;
