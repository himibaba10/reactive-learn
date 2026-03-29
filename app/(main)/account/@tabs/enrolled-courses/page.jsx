import { auth } from '@/auth';
import { getEnrollmentData } from '@/queries/courses.queries';
import { getUserByEmail } from '@/queries/user.queries';
import EnrolledCourseCard from '../../_components/enrolled-course-card';

async function EnrolledCoursesPage() {
  const session = await auth();
  const enrollments = await getEnrollmentData();
  const user = await getUserByEmail(session?.user?.email);

  return (
    <>
      {enrollments && enrollments.length > 0 ? (
        <div className='grid sm:grid-cols-2 gap-6'>
          {enrollments.map((enrollment) => (
            <EnrolledCourseCard
              key={enrollment.id}
              enrollment={enrollment}
              studentId={user?.id}
            />
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center p-8 bg-muted/50 rounded-lg'>
          <p className='text-muted-foreground'>You did not purchase any course yet.</p>
        </div>
      )}
    </>
  );
}

export default EnrolledCoursesPage;
