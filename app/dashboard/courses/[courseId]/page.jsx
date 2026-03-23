import AlertBanner from '@/components/alert-banner';
import { IconBadge } from '@/components/icon-badge';
import { getCourseDetails } from '@/queries/courses.queries';
import { getModulesForCourse } from '@/queries/module.queries';
import { getQuizSets } from '@/queries/quizset.queries';
import { CircleDollarSign, LayoutDashboard, ListChecks } from 'lucide-react';
import { CategoryForm } from './_components/category-form';
import CourseDashboardActions from './_components/course-dashboard-actions';
import { DescriptionForm } from './_components/description-form';
import { ImageForm } from './_components/image-form';
import { ModulesForm } from './_components/module-form';
import { PriceForm } from './_components/price-form';
import { QuizSetForm } from './_components/quiz-set-form';
import { SubtitleForm } from './_components/subtitle-form';
import { TitleForm } from './_components/title-form';

export default async function EditCoursePage({ params: { courseId } }) {
  const course = await getCourseDetails(courseId);
  const modules = await getModulesForCourse(courseId);
  const quizSets = await getQuizSets({ filters: { status: 'active' } });
  return (
    <>
      <AlertBanner
        variant={course?.active ? 'success' : 'warning'}
        label={
          course?.active
            ? 'This course is published.'
            : 'This course is unpublished. It will not be visible in the course.'
        }
      />
      <div className='p-6'>
        <div className='flex items-center justify-end'>
          <CourseDashboardActions course={course} />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          {/* Left side */}
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={LayoutDashboard} />
              <h2 className='text-xl'>Customize your course</h2>
            </div>
            <TitleForm
              initialData={{
                title: course?.title,
              }}
              courseId={course?._id}
            />
            <SubtitleForm
              initialData={{
                subtitle: course?.subtitle,
              }}
              courseId={course?._id}
            />
            <DescriptionForm
              initialData={{ description: course?.description }}
              courseId={course?._id}
            />
            <ImageForm
              initialData={{
                imageUrl:
                  course?.thumbnail &&
                  `/assets/images/courses/${course?.thumbnail}`,
              }}
              courseId={course?._id}
            />
            <CategoryForm
              initialData={{ category: course?.category?.title }}
              courseId={course?._id}
            />

            <QuizSetForm
              initialData={{ title: course?.quizSet?.title }}
              courseId={course?._id}
              options={quizSets}
            />
          </div>

          {/* Right side */}
          <div className='space-y-6'>
            <div>
              <div className='flex items-center gap-x-2 mb-6'>
                <IconBadge icon={ListChecks} />
                <h2 className='text-xl'>Course Modules</h2>
              </div>

              <ModulesForm initialData={modules} courseId={course?._id} />
            </div>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={CircleDollarSign} />
                <h2 className='text-xl'>Sell you course</h2>
              </div>
              <PriceForm
                initialData={{ price: course?.price }}
                courseId={course?._id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
