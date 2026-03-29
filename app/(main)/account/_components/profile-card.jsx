import { getLoggedInUser } from '@/lib/my-helpers';
import Menu from './account-menu';
import ProfilePicture from './profile-picture';

const ProfileCard = async ({ tabs }) => {
  const user = await getLoggedInUser();

  const fullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <div className='lg:flex'>
      <div className='lg:w-1/4 md:px-3'>
        <div className='relative'>
          <div className='p-6 rounded-md shadow dark:shadow-gray-800 bg-background dark:bg-slate-900'>
            <div className='profile-pic text-center mb-5'>
              <div>
                <ProfilePicture
                  fullName={fullName}
                  profilePicture={user?.profilePicture}
                />
                <div className='mt-4'>
                  <h5 className='text-lg font-semibold'>{fullName}</h5>
                  <p className='text-slate-400'>{user?.email}</p>
                </div>
              </div>
            </div>

            <div className='border-t border-gray-100 dark:border-gray-700'>
              <Menu />
            </div>
          </div>
        </div>
      </div>
      <div className='lg:w-3/4 md:px-3 mt-[30px] lg:mt-0'>{tabs}</div>
    </div>
  );
};

export default ProfileCard;
