import { replaceMongoIdInObject } from '@/lib/convertDBData';
import { User } from '@/models/user.model';
import { dbConnect } from '@/service/mongo';
import { hash } from 'bcryptjs';

export const registerUser = async (data) => {
  await dbConnect();
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const hashedPassword = await hash(data.password, 10);

    const user = await User.create({ ...data, password: hashedPassword });
    return replaceMongoIdInObject(user);
  } catch (error) {
    console.error('Some error happened in the registerUser query function');
    console.error(error);
    throw error;
  }
};

