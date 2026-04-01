'use client';

import { SubmitButton } from '@/components/submit-button';
import { changeRoleToInstructor } from '@/app/actions/profile';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const BecomeInstructor = ({ email }) => {
  const router = useRouter();

  const handleUpgrade = async (formData) => {
    if (
      window.confirm(
        'Do you want to upgrade your account to an Instructor? You will gain access to course creation and the instructor dashboard.'
      )
    ) {
      try {
        const result = await changeRoleToInstructor(null, formData);
        
        if (result?.error) {
           toast.error(result.error);
        } else if (result?.success) {
           toast.success('Successfully upgraded to Instructor account.');
           setTimeout(() => {
             router.refresh();
           }, 1500);
        }
      } catch (err) {
        toast.error('An unexpected error occurred during upgrade.');
      }
    }
  };

  return (
    <div className='p-6 rounded-md shadow dark:shadow-gray-800 mt-[30px] border border-primary/20 bg-primary/5'>
      <h5 className='text-lg font-semibold mb-2'>Become an Instructor</h5>
      <p className='text-muted-foreground mb-5 text-sm'>
        Ready to share your knowledge? Upgrade your account to an instructor to start creating and selling courses.
      </p>
      <form action={handleUpgrade}>
        <input type='hidden' name='email' value={email} />
        <SubmitButton
          text={'Upgrade to Instructor'}
          loadingText={'Upgrading...'}
          className={'w-auto'}
        />
      </form>
    </div>
  );
};

export default BecomeInstructor;
