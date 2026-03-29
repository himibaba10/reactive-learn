'use client';
import { deleteCourse, togglePublishCourse } from '@/app/actions/course';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CourseActions } from './course-action';

const CourseDashboardActions = ({ course }) => {
  const router = useRouter();

  const handleCoursePublish = async () => {
    try {
      const response = await togglePublishCourse(course?._id);
      if (!response.success) {
        toast.error(response.error);
        return;
      }
      const updatedCourse = response.data;
      toast.success(
        `Course is ${updatedCourse?.active ? 'published' : 'unpublished'}.`,
      );
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleCourseDelete = async () => {
    try {
      const response = await deleteCourse(course?._id);
      if (!response.success) {
        toast.error(response.error);
        return;
      }
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
