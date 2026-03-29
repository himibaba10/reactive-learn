'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { auth } from '@/auth';
import { Testimonial } from '@/models/testimonial.model';
import { revalidatePath } from 'next/cache';

export const createTestimonial = async ({ courseId, rating, content }) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    await Testimonial.findOneAndUpdate(
      { user: userId, courseId },
      { user: userId, courseId, rating, content },
      { upsert: true, new: true },
    );

    revalidatePath('/courses');
    return actionSuccess(null);
  } catch (error) {
    return actionError(error);
  }
};
