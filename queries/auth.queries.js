import { replaceMongoIdInObject } from '@/lib/convertDBData';
import { User } from '@/models/user.model';
import { hash } from 'bcryptjs';

export const registerUser = async (data) => {
  try {
    const hashedPassword = await hash(data.password, 10);

    const user = await User.create({ ...data, password: hashedPassword });
    return replaceMongoIdInObject(user);
  } catch (error) {
    console.error('Some error happened in the registerUser query function');
    console.error(error);
  }
};
