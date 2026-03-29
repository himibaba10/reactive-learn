import { getCourseInstructorStats } from '@/queries/courses.queries';
import CoursesByInstructor from './_components/CoursesByInstructor';
import InstructorInfo from './_components/InstructorInfo';

const InstructorProfilePage = async ({ searchParams: { instructorId } }) => {
  const instructor = await getCourseInstructorStats(instructorId);

  return (
    <section id='categories' className='space-y-6  py-6  lg:py-12'>
      <div className='container grid grid-cols-12 lg:gap-x-8 gap-y-8'>
        {/* Instructor Info */}
        <InstructorInfo instructor={instructor} />
        {/* Courses */}
        <CoursesByInstructor courses={instructor?.courses} />
      </div>
    </section>
  );
};

export default InstructorProfilePage;
