import { getUserByEmail } from '@/queries/user.queries';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const useLoggedinUser = () => {
  const { data: session } = useSession();
  const [loggedInUser, setLoggedInUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      if (session?.user) {
        const user = await getUserByEmail(session?.user?.email);
        setLoggedInUser(user);
      }
    };
    getUser();
  }, [session?.user]);
  return { loggedInUser };
};

export default useLoggedinUser;
