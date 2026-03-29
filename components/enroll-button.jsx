'use client';

import { createCheckoutSession } from '@/app/actions/stripe';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button, buttonVariants } from './ui/button';

const EnrollButton = ({ asLink, courseId, courseTitle, coursePrice }) => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const formAction = async (formData) => {
    if (status === 'loading') return;

    if (!session?.user) {
      return router.push('/login');
    }

    try {
      const sessionResponse = await createCheckoutSession(formData);
      
      if (sessionResponse?.error) {
        toast.error(sessionResponse.error);
        return;
      }
      
      if (sessionResponse?.url) {
        window.location.assign(sessionResponse.url);
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred during checkout');
    }
  };

  return (
    <form action={formAction}>
      <input type='hidden' name='courseId' value={courseId} />
      <input type='hidden' name='courseName' value={courseTitle} />
      <input type='hidden' name='coursePrice' value={coursePrice} />
      <input type='hidden' name='email' value={session?.user?.email} />
      {asLink ? (
        <Button
          type='submit'
          variant='ghost'
          className='text-xs text-sky-700 h-7 gap-1'
        >
          Enroll
          <ArrowRight className='w-3' />
        </Button>
      ) : (
        <Button
          type='submit'
          href=''
          className={cn(buttonVariants({ size: 'lg' }))}
        >
          Enroll Now
        </Button>
      )}
    </form>
  );
};

export default EnrollButton;
