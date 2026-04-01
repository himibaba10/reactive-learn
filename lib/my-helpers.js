import { auth } from '@/auth';
import { getCoursesByInstructor } from '@/queries/courses.queries';
import { getUserByEmail } from '@/queries/user.queries';

export const myStats = async () => {
  const session = await auth();
  if (!session) throw new Error('Session not found');

  const myCourses = await getCoursesByInstructor(session?.user?.id);
  return myCourses;
};

export const getLoggedInUser = async () => {
  const session = await auth();
  if (!session) throw new Error('Session not found');

  const user = await getUserByEmail(session?.user?.email);

  if (!user) throw new Error('User not found');

  return user;
};
