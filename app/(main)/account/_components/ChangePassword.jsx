'use client';

import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAccount from '@/hooks/use-account';

const ChangePassword = ({ email }) => {
  const { formRef, formAction } = useAccount('update-password');
  return (
    <div>
      <h5 className='text-lg font-semibold mb-4'>Change password :</h5>
      <form ref={formRef} action={formAction}>
        <input type='hidden' name='email' value={email} />
        <div className='grid grid-cols-1 gap-5'>
          <div>
            <Label className='mb-2 block'>Old password :</Label>
            <Input
              type='password'
              name='password'
              placeholder='Old password'
              required
            />
          </div>
          <div>
            <Label className='mb-2 block'>New password :</Label>
            <Input
              type='password'
              name='newPassword'
              placeholder='New password'
              required
            />
          </div>
          <div>
            <Label className='mb-2 block'>Re-type New password :</Label>
            <Input
              type='password'
              name='confirmNewPassword'
              placeholder='Re-type New password'
              required
            />
          </div>
        </div>
        <SubmitButton
          text={'Save Password'}
          loadingText={'Saving Password...'}
          className={'mt-5 w-auto'}
        />
      </form>
    </div>
  );
};

export default ChangePassword;
