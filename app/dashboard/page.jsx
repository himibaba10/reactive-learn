import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/formatPrice';
import { getCourseInstructorStats } from '@/queries/courses.queries';
import { DashboardCharts } from './_components/DashboardCharts';
import { BookOpen, Users2, CircleDollarSign } from 'lucide-react';

export const metadata = {
  title: 'Teacher Dashboard | Reactive Learn',
};

const DashboardPage = async () => {
  const session = await auth();
  const stats = await getCourseInstructorStats(session?.user?.id);

  // Group by Course
  const courseStats =
    stats?.courses?.map((course) => {
      const enrollmentsForCourse = stats.enrollments.filter((e) => e.course?._id?.toString() === course._id?.toString());
      return {
        name: course.title,
        enrollments: enrollmentsForCourse.length,
        revenue: enrollmentsForCourse.reduce((acc, curr) => acc + (curr.course?.price || 0), 0),
      };
    }) || [];

  // Group by Month
  const revenueByMonthMap =
    stats?.enrollments?.reduce((acc, enrollment) => {
      const date = new Date(enrollment.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = { name: monthYear, revenue: 0, enrollments: 0 };
      }
      acc[monthYear].revenue += enrollment.course?.price || 0;
      acc[monthYear].enrollments += 1;
      return acc;
    }, {}) || {};

  const revenueByMonth = Object.values(revenueByMonthMap);

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Instructor Dashboard</h1>
        <p className='text-muted-foreground mt-2'>Welcome back! Here&apos;s an overview of your platform&apos;s performance.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {/* total courses */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Courses</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-full">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{stats?.courses?.length || 0}</div>
          </CardContent>
        </Card>
        {/* total enrollments */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Enrollments</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users2 className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{stats?.students || 0}</div>
          </CardContent>
        </Card>
        {/* total revenue */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <CircleDollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{formatPrice(stats?.revenue || 0)}</div>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts courseStats={courseStats} revenueByMonth={revenueByMonth} />
    </div>
  );
};

export default DashboardPage;
