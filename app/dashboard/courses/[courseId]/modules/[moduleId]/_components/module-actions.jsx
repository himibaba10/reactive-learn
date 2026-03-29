'use client';

import { deleteModule, togglePublishModule } from '@/app/actions/module';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CourseActions } from '../../../_components/course-action';

const ModuleActions = ({ mod }) => {
  const router = useRouter();

  const handleModulePublish = async () => {
    try {
      const response = await togglePublishModule(mod?._id);
      if (!response.success) {
        toast.error(response.error);
        return;
      }
      const updatedModule = response.data;
      toast.success(
        `Module is ${updatedModule?.status === 'active' ? 'published' : 'unpublished'}.`,
      );
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleModuleDelete = async () => {
    try {
      const response = await deleteModule(mod?._id);
      if (!response.success) {
        toast.error(response.error);
        return;
      }
      toast.success('Module deleted successfully');

      router.push(`/dashboard/courses/${mod?.course}`);
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <CourseActions
        title='module'
        isPublished={mod?.status === 'active'}
        onTogglePublish={handleModulePublish}
        onDelete={handleModuleDelete}
      />
    </>
  );
};

export default ModuleActions;
