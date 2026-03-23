import { auth } from '@/auth';
import { getUserByEmail } from '@/queries/user.queries';
import ChangePassword from '../_components/ChangePassword';
import ContactInfo from '../_components/ContactInfo';
import PersonalDetails from '../_components/PersonalDetails';

async function Profile() {
  const session = await auth();

  const user = await getUserByEmail(session?.user?.email);
  return (
    <>
      <PersonalDetails user={user} />

      <div className='p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-[30px]'>
        <div className='grid lg:grid-cols-2 grid-cols-1 gap-5'>
          <ContactInfo user={user} />
          <ChangePassword email={user?.email} />
        </div>
      </div>
    </>
  );
}

export default Profile;
