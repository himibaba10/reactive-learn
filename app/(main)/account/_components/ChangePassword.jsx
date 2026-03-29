'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAccount from '@/hooks/use-account';

const ChangePassword = ({ email }) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { formRef, formAction } = useAccount('update-password');
  return (
    <div>
      <h5 className='text-lg font-semibold mb-4'>Change password :</h5>
      <form ref={formRef} action={formAction}>
        <input type='hidden' name='email' value={email} />
        <div className='grid grid-cols-1 gap-5'>
          <div>
            <Label className='mb-2 block'>Old password :</Label>
            <div className='relative'>
              <Input
                type={showOldPassword ? 'text' : 'password'}
                name='password'
                placeholder='Old password'
                required
              />
              <button
                type='button'
                onClick={() => setShowOldPassword(!showOldPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <Label className='mb-2 block'>New password :</Label>
            <div className='relative'>
              <Input
                type={showNewPassword ? 'text' : 'password'}
                name='newPassword'
                placeholder='New password'
                required
              />
              <button
                type='button'
                onClick={() => setShowNewPassword(!showNewPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <Label className='mb-2 block'>Re-type New password :</Label>
            <div className='relative'>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmNewPassword'
                placeholder='Re-type New password'
                required
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
