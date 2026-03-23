import { auth } from '@/auth';
import { getCoursesByInstructor } from '@/queries/courses.queries';
import { getUserByEmail } from '@/queries/user.queries';
import { redirect } from 'next/navigation';

export const myStats = async () => {
  const session = await auth();
  const myCourses = await getCoursesByInstructor(session?.user?.id);
  return myCourses;
};

export const getLoggedInUser = async () => {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);

  if (!user) return redirect('/login');

  return user;
};
