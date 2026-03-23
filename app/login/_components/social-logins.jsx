import { handleSocialLogin } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const SocialLogins = () => {
  return (
    <>
      <div className='text-center text-md mt-3 text-gray-500'>
        or Signup with
      </div>
      <form action={handleSocialLogin}>
        <div className='flex justify-center gap-2'>
          <Button
            className='mt-4 py-2 border-gray-600/30 border rounded-md flex items-center gap-2 justify-center'
            type='submit'
            name='action'
            value='google'
          >
            <Image src='/google.png' alt='google' width={20} height={20} />
            <span>Google</span>
          </Button>
        </div>
      </form>
    </>
  );
};

export default SocialLogins;
