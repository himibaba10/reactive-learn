import { Course } from '@/models/course.model';
import { User } from '@/models/user.model';
import { dbConnect } from '@/service/mongo';

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 !== 0 ? 1 : 0) + ' k+';
  }
  return num.toString();
};

const HomeStats = async () => {
  await dbConnect();

  const [activeStudents, totalCourses, totalInstructors] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Course.countDocuments(),
    User.countDocuments({ role: 'teacher' }),
  ]);

  const stats = [
    {
      value: formatNumber(activeStudents),
      label: 'Active Students',
    },
    {
      value: formatNumber(totalCourses),
      label: 'Total Courses',
    },
    {
      value: formatNumber(totalInstructors),
      label: 'Instructors',
    },
    {
      value: '100 %+',
      label: 'Satisfaction Rate',
    },
  ];

  return (
    <section className="w-full bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 md:p-8 bg-secondary/10 dark:bg-secondary/5 rounded-2xl hover:bg-secondary/20 transition-colors duration-300"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </h3>
              <p className="text-sm md:text-base font-semibold text-muted-foreground text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
