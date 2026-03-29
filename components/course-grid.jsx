import CourseCard from '@/app/(main)/courses/_components/CourseCard';

const CourseGrid = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className='lg:col-span-3 flex items-center justify-center p-12 bg-muted/50 rounded-lg'>
        <p className='text-muted-foreground'>No courses found right now.</p>
      </div>
    );
  }

  return (
    <div className='lg:col-span-3 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;
