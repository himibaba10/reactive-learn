'use client';
import { deleteCourse, togglePublishCourse } from '@/app/actions/course';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CourseActions } from './course-action';

const CourseDashboardActions = ({ course }) => {
  const router = useRouter();

  const handleCoursePublish = async () => {
    const updatedCourse = await togglePublishCourse(course?._id);
    toast.success(
      `Course is ${updatedCourse?.active ? 'published' : 'unpublished'}.`,
    );
  };

  const handleCourseDelete = async () => {
    try {
      await deleteCourse(course?._id);
      toast.success('Course deleted successfully');

      router.push(`/dashboard`);
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <CourseActions
      isPublished={course.active}
      title='course'
      onTogglePublish={handleCoursePublish}
      onDelete={handleCourseDelete}
    />
  );
};

export default CourseDashboardActions;
