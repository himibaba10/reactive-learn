import AlertBanner from '@/components/alert-banner';
import { IconBadge } from '@/components/icon-badge';
import { getLessonsByModuleId } from '@/queries/lesson.queries';
import { getModuleById } from '@/queries/module.queries';
import { ArrowLeft, BookOpenCheck, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { LessonForm } from './_components/lesson-form';
import ModuleActions from './_components/module-actions';
import { ModuleDescriptionForm } from './_components/module-description-form';
import { ModuleTitleForm } from './_components/module-title-form';

const Module = async ({ params: { moduleId } }) => {
  const mod = await getModuleById(moduleId);
  const lessons = await getLessonsByModuleId(moduleId);

  return (
    <>
      <AlertBanner
        label={
          mod?.status === 'active'
            ? 'This module is published.'
            : 'This module is unpublished. It will not be visible in the course.'
        }
        variant={mod?.status === 'active' ? 'success' : 'warning'}
      />

      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='w-full'>
            <Link
              href={`/dashboard/courses/${mod?.course}`}
              className='flex items-center text-sm hover:opacity-75 transition mb-6'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to course setup
            </Link>
            <div className='flex items-center justify-end'>
              <ModuleActions mod={mod} />
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div className='space-y-4'>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={LayoutDashboard} />
                <h2 className='text-xl'>Customize Your module</h2>
              </div>
              <ModuleTitleForm title={mod?.title} moduleId={mod?._id} />
              <ModuleDescriptionForm
                description={mod?.description}
                moduleId={mod?._id}
              />
            </div>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={BookOpenCheck} />
                <h2 className='text-xl'>Module Lessons</h2>
              </div>
              <LessonForm
                moduleId={mod?._id} // ← pass moduleId
                initialLessons={lessons} // ← pass real lessons
              />
            </div>
          </div>
          <div>
            <div className='flex items-center gap-x-2'>
              {/* <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2> */}
            </div>
            {/* <ChapterVideoForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Module;
