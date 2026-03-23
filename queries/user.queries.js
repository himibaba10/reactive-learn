'use server';

import { compare, hash } from 'bcryptjs';

const { replaceMongoIdInObject } = require('@/lib/convertDBData');
const { User } = require('@/models/user.model');

export const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).lean();

  return replaceMongoIdInObject(user);
};

export const getUserById = async (id) => {
  const user = await User.findById(id).lean();

  return replaceMongoIdInObject(user);
};

export const updatePersonalDetail = async (data) => {
  await User.findOneAndUpdate({ email: data?.email }, data);
};

export const updatePassword = async (data) => {
  const { email, password, newPassword, confirmNewPassword } = data;

  if (password === newPassword)
    throw new Error('You cannot use old password as a new one.');

  if (newPassword !== confirmNewPassword)
    throw new Error('New password and confirm new password in not the same.');

  const user = await User.findOne({ email });

  const passwordMatched = await compare(password, user?.password);

  if (!passwordMatched) throw new Error('Incorrect password.');

  const hashedPassword = await hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();
};

export const updateContactInfo = async (data, email) => {
  await User.findOneAndUpdate({ email }, data);
};
