'use server';

import { auth } from '@/auth';
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from '@/lib/convertDBData';
import { Category } from '@/models/category.model';
import { Course } from '@/models/course.model';
import { Enrollment } from '@/models/enrollment.model';
import { Lesson } from '@/models/lesson.model';
import { Module } from '@/models/module.model';
import { QuizSet } from '@/models/quizset.model';
import { Testimonial } from '@/models/testimonial.model';
import { User } from '@/models/user.model';
import { notFound } from 'next/navigation';
import { getUserById } from './user.queries';

export const createCourse = async (payload) => {
  const session = await auth();
  const course = await Course.create({
    ...payload,
    instructor: session?.user?.id,
  });
  return replaceMongoIdInObject(course);
};

export const getEnrollmentData = async () => {
  const session = await auth();
  const user = await User.findOne({ email: session?.user?.email });

  const enrollments = await Enrollment.find({ student: user._id })
    .populate({
      path: 'course',
      module: Course,
      populate: [
        {
          path: 'category',
          module: Category,
        },
        {
          path: 'quizSet',
          module: QuizSet,
        },
      ],
    })
    .populate({ path: 'student', module: User })
    .lean();

  return replaceMongoIdInArray(enrollments);
};

export const getCourseList = async ({ queries, filter }) => {
  const options = {
    sortBy: '-createdAt',
  };
  if (queries?.sortBy) {
    options.sortBy = queries?.sortBy;
  }
  if (queries?.limit) {
    options.limit = parseInt(queries?.limit);
  }

  // Build search query
  let searchFilter = { ...filter };
  if (queries?.search) {
    searchFilter.$or = [
      { title: { $regex: queries.search, $options: 'i' } },
      { subtitle: { $regex: queries.search, $options: 'i' } },
      { 'instructor.name': { $regex: queries.search, $options: 'i' } },
      { 'category.name': { $regex: queries.search, $options: 'i' } },
    ];
  }

  let courses = await Course.find(searchFilter)
    .select('title subtitle thumbnail modules price category instructor')
    .populate({
      path: 'modules',
      model: Module,
    })
    .populate({
      path: 'category',
      model: Category,
    })
    .populate({
      path: 'instructor',
      model: User,
    })
    .populate({
      path: 'testimonials',
      model: Testimonial,
    })
    .sort(options?.sortBy)
    .limit(options?.limit)
    .lean();

  // Add enrollment status for logged in users
  const session = await auth();
  if (!session?.user) return replaceMongoIdInArray(courses);

  let enrolledCourses = await getEnrollmentData();
  let enrolledCourseIds = enrolledCourses.map((course) => {
    return course?.course?._id.toString();
  });

  courses = courses?.map((course) => {
    if (enrolledCourseIds.includes(course._id.toString()))
      return { ...course, enrolled: true };
    return course;
  });

  return replaceMongoIdInArray(courses);
};

export const getCourseDetails = async (id) => {
  let course = await Course.findById(id)
    .populate({
      path: 'modules',
      model: Module,
      populate: {
        path: 'lessonIds',
        module: Lesson,
      },
    })
    .populate({
      path: 'category',
      model: Category,
    })
    .populate({
      path: 'instructor',
      model: User,
    })
    .populate({
      path: 'testimonials',
      model: Testimonial,
      populate: {
        path: 'user',
        model: User,
      },
    })
    .populate({
      path: 'quizSet',
      model: QuizSet,
    })
    .lean();

  if (!course) return notFound();

  const session = await auth();
  if (!session?.user) return replaceMongoIdInObject(course);

  let enrolledCourses = await getEnrollmentData();
  let isEnrolledToCourse = enrolledCourses.some(
    (enrollment) =>
      enrollment?.course?._id?.toString() === course._id.toString(),
  );

  if (isEnrolledToCourse) course.enrolled = true;

  return replaceMongoIdInObject(course);
};

export const getCoursesByInstructor = async (instructorId) => {
  const coursesByInstructor = await Course.find({
    instructor: instructorId,
  }).lean();

  return replaceMongoIdInArray(coursesByInstructor);
};

export const getCourseInstructorStats = async (instructorId, expand) => {
  const instructor = await getUserById(instructorId);
  let coursesByInstructor = await getCoursesByInstructor(instructorId);
  const courseIds = coursesByInstructor.map((c) => c.id);

  const enrollments = await Enrollment.find({
    course: { $in: courseIds },
  }).populate({
    path: 'course',
    model: Course,
  });

  const revenue = enrollments.reduce(
    (acc, curr) => acc + curr?.course?.price,
    0,
  );

  const totalReviews = await Testimonial.find({
    courseId: { $in: courseIds },
  });

  const averageReviews = Number(
    (
      totalReviews.reduce((acc, curr) => acc + curr.rating, 0) /
      totalReviews.length
    ).toFixed(1),
  );

  // Add enrollment status for logged in users
  const session = await auth();
  if (session?.user) {
    let enrolledCourses = await getEnrollmentData();
    let enrolledCourseIds = enrolledCourses.map((course) => {
      return course?.course?._id?.toString();
    });

    coursesByInstructor = coursesByInstructor?.map((course) => {
      if (enrolledCourseIds.includes(course.id.toString()))
        return { ...course, enrolled: true };
      return course;
    });
  }
  if (expand) {
    return {
      coursesByInstructor,
      students: enrollments,
      reviews: totalReviews,
    };
  }

  return {
    ...instructor,
    coursesByInstructor,
    students: enrollments.length,
    reviews: totalReviews.length,
    averageReviews,
    revenue,
  };
};

export const updateCourse = async (courseId, data) => {
  if (data.category) {
    const category = await Category.findOne({ title: data.category }).lean();
    await Course.findByIdAndUpdate(courseId, { category: category?._id });
    return category;
  }
  await Course.findByIdAndUpdate(courseId, data);
};
