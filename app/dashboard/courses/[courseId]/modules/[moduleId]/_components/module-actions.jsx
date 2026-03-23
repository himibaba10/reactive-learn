'use client';

import { deleteModule, togglePublishModule } from '@/app/actions/module';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CourseActions } from '../../../_components/course-action';

const ModuleActions = ({ mod }) => {
  const router = useRouter();

  const handleModulePublish = async () => {
    const updatedModule = await togglePublishModule(mod?._id);
    toast.success(
      `Module is ${updatedModule?.status === 'active' ? 'published' : 'unpublished'}.`,
    );
  };

  const handleModuleDelete = async () => {
    try {
      await deleteModule(mod?._id);
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
