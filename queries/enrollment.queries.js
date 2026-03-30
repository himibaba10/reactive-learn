import { replaceMongoIdInArray } from '@/lib/convertDBData';
import { formatDate } from '@/lib/formatDate';
import { Course } from '@/models/course.model';
import { Enrollment } from '@/models/enrollment.model';
import { User } from '@/models/user.model';
import { dbConnect } from '@/service/mongo';
import { getAReport } from './report.queries';

export const addEnrollment = async (data) => {
  await dbConnect();
  const enrollment = await Enrollment.create({
    ...data,
    method: 'stripe',
    status: 'not-started',
    enrollmentDate: new Date(),
  });

  return enrollment;
};

export const getEnrollmentInfo = async (data) => {
  await dbConnect();
  const enrollment = await Enrollment.findOne({
    course: data.course,
    student: data.student,
  });

  return enrollment;
};

export const getEnrollmentsForCourse = async (courseId) => {
  await dbConnect();
  const enrollments = await Enrollment.find({ course: courseId })
    .populate({
      path: 'course',
      model: Course,
    })
    .populate({
      path: 'student',
      model: User,
    })
    .lean();
  return replaceMongoIdInArray(enrollments);
};

export const getEnrollmentsWithReport = async (courseId) => {
  let enrollments = await getEnrollmentsForCourse(courseId);

  const reports = await Promise.all(
    enrollments?.map((enrollment) =>
      getAReport({
        courseId: enrollment?.course,
        studentId: enrollment?.student,
      }),
    ),
  );

  enrollments = enrollments?.map((enrollment, idx) => ({
    ...enrollment,
    fullName: `${enrollment?.student?.firstName} ${enrollment?.student?.lastName}`,
    quizMark: reports?.[idx]?.quizMark,
    progress: `${reports?.[idx]?.moduleCompletionProgress}%` ?? '0%',
    createdAt: formatDate(enrollment?.createdAt),
  }));

  return enrollments;
};

export async function hasEnrollmentForCourse(courseId, studentId) {
  await dbConnect();
  try {
    const enrollment = await Enrollment.findOne({
      course: courseId,
      student: studentId,
    })
      .populate({
        path: 'course',
        model: Course,
      })
      .lean();

    if (!enrollment) return false;

    return true;
  } catch (error) {
    throw new Error(error);
  }
}
