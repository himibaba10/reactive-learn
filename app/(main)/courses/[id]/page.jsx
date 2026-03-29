import { getCourseDetails } from '@/queries/courses.queries';
import { notFound } from 'next/navigation';
import CourseDetails from './_components/CourseDetails';
import CourseDetailsIntro from './_components/CourseDetailsIntro';
import RelatedCourses from './_components/RelatedCourses';
import Testimonials from './_components/Testimonials';

export async function generateMetadata({ params: { id } }) {
  const course = await getCourseDetails(id);

  if (!course.active) return notFound();

  return {
    title: `${course?.title} | Reactive Learn`,
    description: course?.description,
  };
}

const SingleCoursePage = async ({ params: { id } }) => {
  const course = await getCourseDetails(id);
  return (
    <>
      <CourseDetailsIntro course={course} />

      <CourseDetails course={course} />

      {course?.testimonials && <Testimonials testimonials={course?.testimonials} />}

      <RelatedCourses />
    </>
  );
};
export default SingleCoursePage;
