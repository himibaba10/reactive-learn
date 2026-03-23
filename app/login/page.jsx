import { LoginForm } from './_components/login-form';
import SocialLogins from './_components/social-logins';

export const metadata = {
  title: 'Login | Reactive Learn',
};

const LoginPage = () => {
  return (
    <div className='w-full flex-col h-screen flex items-center justify-center'>
      <div className='container'>
        <LoginForm />
        <SocialLogins />
      </div>
    </div>
  );
};
export default LoginPage;
