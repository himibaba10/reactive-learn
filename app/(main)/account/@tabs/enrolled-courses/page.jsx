import { auth } from '@/auth';
import { getEnrollmentData } from '@/queries/courses.queries';
import { getUserByEmail } from '@/queries/user.queries';
import EnrolledCourseCard from '../../_components/enrolled-course-card';

async function EnrolledCoursesPage() {
  const session = await auth();
  const enrollments = await getEnrollmentData();
  const user = await getUserByEmail(session?.user?.email);

  return (
    <div className='grid sm:grid-cols-2 gap-6'>
      {enrollments?.map((enrollment) => (
        <EnrolledCourseCard
          key={enrollment.id}
          enrollment={enrollment}
          studentId={user?.id}
        />
      ))}
    </div>
  );
}

export default EnrolledCoursesPage;
