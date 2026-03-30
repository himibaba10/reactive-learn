import CourseGrid from '@/components/course-grid';
import { getCategories } from '@/queries/categories.queries';
import { getCourseList } from '@/queries/courses.queries';
import FilterCourse from './_components/FilterCourse';
import FilterCourseMobile from './_components/FilterCourseMobile';
import SearchCourse from './_components/SearchCourse';
import SortCourse from './_components/SortCourse';

export const metadata = {
  title: 'Courses | Reactive Learn',
};

const CoursesPage = async ({ searchParams }) => {
  const queries = {
    search: searchParams?.search || '',
    sortBy: searchParams?.sortBy || '',
    limit: searchParams?.limit || '',
  };

  let filter = { active: true };
  if (searchParams?.categories) {
    filter.category = {
      $in: searchParams.categories.split(','),
    };
  }

  const [courses, categories] = await Promise.all([getCourseList({ queries, filter }), getCategories()]);

  return (
    <section className='container space-y-6 dark:bg-transparent py-6'>
      <div className='flex items-baseline justify-between  border-gray-200 border-b pb-6 flex-col gap-4 lg:flex-row'>
        <SearchCourse />
        <div className='flex items-center justify-between lg:justify-end gap-2 max-lg:w-full'>
          <SortCourse />
          <FilterCourseMobile />
        </div>
      </div>

      <section className='pb-24 pt-6 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4'>
        <FilterCourse categories={categories} />
        <CourseGrid courses={courses} />
      </section>
    </section>
  );
};

export default CoursesPage;
