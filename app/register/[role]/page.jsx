import { notFound } from 'next/navigation';
import { SignupForm } from '../_components/signup-form';

export const metadata = {
  title: 'Register | Reactive Learn',
};

const RegisterPage = ({ params: { role } }) => {
  if (role !== 'student' && role !== 'instructor') notFound();

  return (
    <div className='w-full flex-col h-screen flex items-center justify-center'>
      <div className='container'>
        <SignupForm role={role} />
      </div>
    </div>
  );
};
export default RegisterPage;
