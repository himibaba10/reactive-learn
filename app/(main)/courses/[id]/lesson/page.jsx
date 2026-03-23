import { Separator } from '@/components/ui/separator';
import { getCourseDetails } from '@/queries/courses.queries';
import { getLessonBySlug } from '@/queries/lesson.queries';
import VideoDescription from './_components/video-description';
import { VideoPlayer } from './_components/video-player';

export async function generateMetadata({ params: { id } }) {
  const course = await getCourseDetails(id);

  if (!course.active) return notFound();

  return {
    title: `${course?.title} | Reactive Learn`,
    description: course?.description,
  };
}

const Course = async ({ params: { id }, searchParams: { name, module } }) => {
  let lesson;
  let moduleId;

  if (name) {
    lesson = await getLessonBySlug(name);
    moduleId = module;
  } else {
    const course = await getCourseDetails(id);

    const firstModule = course?.modules?.sort(
      (a, b) => a.position - b.position,
    )[0];

    lesson = firstModule?.lessonIds?.sort((a, b) => a.position - b.position)[0];
    moduleId = firstModule?._id;
  }

  return (
    <div>
      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        <div className='p-4 w-full'>
          <VideoPlayer
            videoUrl={lesson?.videoUrl}
            lessonId={lesson?._id}
            moduleId={moduleId}
            extend={true}
            courseId={id}
          />
        </div>
        <div>
          <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
            <h2 className='text-2xl font-semibold mb-2'>{lesson?.title}</h2>
          </div>
          <Separator />
          <VideoDescription description={lesson?.description} />
        </div>
      </div>
    </div>
  );
};
export default Course;
