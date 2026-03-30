'use server';

import { compare, hash } from 'bcryptjs';
import { replaceMongoIdInObject } from '@/lib/convertDBData';
import { User } from '@/models/user.model';
import { dbConnect } from '@/service/mongo';

export const getUserByEmail = async (email) => {
  await dbConnect();
  const user = await User.findOne({ email }).lean();

  return replaceMongoIdInObject(user);
};

export const getUserById = async (id) => {
  await dbConnect();
  const user = await User.findById(id).lean();

  return replaceMongoIdInObject(user);
};

export const updatePersonalDetail = async (data) => {
  await dbConnect();
  await User.findOneAndUpdate({ email: data?.email }, data);
};

export const updatePassword = async (data) => {
  await dbConnect();
  const { email, password, newPassword, confirmNewPassword } = data;

  if (password === newPassword)
    throw new Error('You cannot use your old password as the new one.');

  if (newPassword !== confirmNewPassword)
    throw new Error('New password and confirm password do not match.');

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found.');
  }

  const passwordMatched = await compare(password, user.password);

  if (!passwordMatched) throw new Error('Current password is incorrect.');

  const hashedPassword = await hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();
};


export const updateContactInfo = async (data, email) => {
  await dbConnect();
  await User.findOneAndUpdate({ email }, data);
};
