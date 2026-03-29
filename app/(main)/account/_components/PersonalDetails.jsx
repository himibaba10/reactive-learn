'use client';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useAccount from '@/hooks/use-account';

const PersonalDetails = ({ user }) => {
  const { formAction } = useAccount('update-personal-detail');
  return (
    <div className='p-6 rounded-md shadow dark:shadow-gray-800 bg-background dark:bg-slate-900'>
      <h5 className='text-lg font-semibold mb-4'>Personal Detail :</h5>
      <form action={formAction}>
        <div className='grid lg:grid-cols-2 grid-cols-1 gap-5'>
          <div>
            <Label className='mb-2 block'>
              First Name : <span className='text-red-600'>*</span>
            </Label>
            <Input
              type='text'
              placeholder='First Name:'
              name='firstName'
              defaultValue={user?.firstName}
              required
            />
          </div>
          <div>
            <Label className='mb-2 block'>
              Last Name : <span className='text-red-600'>*</span>
            </Label>
            <Input
              type='text'
              placeholder='Last Name:'
              name='lastName'
              defaultValue={user?.lastName}
              required
            />
          </div>
          <div>
            <Label className='mb-2 block'>
              Your Email : <span className='text-red-600'>*</span>
            </Label>
            <Input
              type='email'
              placeholder='Email'
              name='email'
              defaultValue={user?.email}
              readOnly
              className='read-only:opacity-50'
            />
          </div>
          <div>
            <Label className='mb-2 block'>Designation :</Label>
            <Input
              name='designation'
              type='text'
              defaultValue={user?.designation}
              placeholder='Designation :'
            />
          </div>
        </div>
        {/*end grid*/}
        <div className='grid grid-cols-1'>
          <div className='mt-5'>
            <Label className='mb-2 block'>Bio :</Label>
            <Textarea
              name='bio'
              placeholder='Message :'
              defaultValue={user?.bio}
            />
          </div>
        </div>
        <SubmitButton
          text={'Save Changes'}
          loadingText={'Saving Changes'}
          className={'w-auto mt-5'}
        />
      </form>
    </div>
  );
};

export default PersonalDetails;
