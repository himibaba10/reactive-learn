'use client';

import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAccount from '@/hooks/use-account';

const ContactInfo = ({ user }) => {
  const { formAction } = useAccount('update-contact-info');
  return (
    <div>
      <h5 className='text-lg font-semibold mb-4'>Contact Info :</h5>
      <form action={formAction}>
        <input type='hidden' name='email' value={user?.email} />
        <div className='grid grid-cols-1 gap-5'>
          <div>
            <Label className='mb-2 block'>Phone No. :</Label>
            <Input
              name='phone'
              type='number'
              placeholder='Phone :'
              className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              defaultValue={user?.phone}
            />
          </div>
          <div>
            <Label className='mb-2 block'>Website :</Label>
            <Input
              name='url'
              type='url'
              placeholder='Url :'
              defaultValue={user?.socialMedia?.url}
            />
          </div>
          <div>
            <Label className='mb-2 block'>Facebook :</Label>
            <Input
              name='facebook'
              type='url'
              placeholder='FB Url :'
              defaultValue={user?.socialMedia?.facebook}
            />
          </div>
        </div>
        <SubmitButton text={'Add'} loadingText={'Adding...'} className='mt-5' />
      </form>
    </div>
  );
};

export default ContactInfo;
