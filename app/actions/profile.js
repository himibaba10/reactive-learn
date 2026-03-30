'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { auth } from '@/auth';
import { getLoggedInUser } from '@/lib/my-helpers';
import { User } from '@/models/user.model';
import { dbConnect } from '@/service/mongo';
import {
  updateContactInfo,
  updatePassword,
  updatePersonalDetail,
} from '@/queries/user.queries';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

export const handleChangePersonalDetail = async (prevState, formData) => {
  try {
    await dbConnect();
    const session = await auth();
    if (formData.get('email') !== session?.user?.email)
      return actionError('You are not allowed to update data of another user.');

    const info = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      designation: formData.get('designation'),
      bio: formData.get('bio'),
    };

    await updatePersonalDetail(info);
    revalidatePath('/account');

    return actionSuccess(null, 'Data updated successfully.');
  } catch (error) {
    console.error(
      'An unexpected error happened in handleChangePersonalDetail action',
    );
    console.error(error);
    return actionError(error);
  }
};

export const handleChangePassword = async (prevState, formData) => {
  try {
    await dbConnect();
    const session = await auth();
    if (formData.get('email') !== session?.user?.email)
      return actionError('You are not allowed to update data of another user.');

    const info = {
      email: formData.get('email'),
      password: formData.get('password'),
      newPassword: formData.get('newPassword'),
      confirmNewPassword: formData.get('confirmNewPassword'),
    };

    await updatePassword(info);

    return actionSuccess(null, 'Password changed successfully.');
  } catch (error) {
    console.error(
      'An unexpected error happened in handleChangePassword action',
    );
    console.error(error);
    return actionError(error);
  }
};

export const handleChangeContactInfo = async (prevState, formData) => {
  try {
    await dbConnect();
    const session = await auth();
    const email = formData.get('email');
    if (email !== session?.user?.email)
      return actionError('You are not allowed to update data of another user.');

    const info = {
      phone: formData.get('phone'),
      socialMedia: {
        url: formData.get('url'),
        facebook: formData.get('facebook'),
      },
    };

    await updateContactInfo(info, email);

    return actionSuccess(null, 'Contact info successfully.');
  } catch (error) {
    console.error(
      'An unexpected error happened in handleChangeContactInfo action',
    );
    console.error(error);
    return actionError(error);
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const updateProfilePicture = async (cloudinaryUrl) => {
  await dbConnect();
  const loggedInUser = await getLoggedInUser();

  await User.findByIdAndUpdate(loggedInUser?.id, {
    profilePicture: cloudinaryUrl,
    updatedAt: new Date(),
  });

  revalidatePath('/profile');

  return actionSuccess(cloudinaryUrl);
};
