import { replaceMongoIdInArray } from '@/lib/convertDBData';
import { Course } from '@/models/course.model';
import { Testimonial } from '@/models/testimonial.model';
import { User } from '@/models/user.model';
import { dbConnect } from '@/service/mongo';

export const getReviewsForCourse = async (courseId) => {
  await dbConnect();
  const reviews = await Testimonial.find({ courseId })
    .populate({ path: 'courseId', model: Course })
    .populate({ path: 'user', model: User })
    .lean();

  return replaceMongoIdInArray(reviews);
};

export const getTestimonialByUser = async ({ courseId, studentId }) => {
  await dbConnect();
  const testimonial = await Testimonial.findOne({
    courseId,
    user: studentId,
  }).lean();
  return testimonial;
};
