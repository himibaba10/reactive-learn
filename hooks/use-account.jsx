import { handleRegisterUser } from '@/app/actions/auth';
import { handleChangeContactInfo, handleChangePassword, handleChangePersonalDetail } from '@/app/actions/profile';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

const useAccount = (action) => {
  const router = useRouter();
  const formRef = useRef(null);

  let handler;
  if (action === 'register') handler = handleRegisterUser;
  if (action === 'update-personal-detail') handler = handleChangePersonalDetail;
  if (action === 'update-password') handler = handleChangePassword;
  if (action === 'update-contact-info') handler = handleChangeContactInfo;

  if (!handler) throw new Error('You did not provide correct action on useAccount hook');

  const [state, formAction] = useFormState(handler, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      formRef.current?.reset();

      if (action === 'register') {
        const timer = setTimeout(() => router.push('/login'), 1500);
        return () => clearTimeout(timer);
      }
    }

    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router, action]);

  return { formAction, formRef };
};

export default useAccount;
