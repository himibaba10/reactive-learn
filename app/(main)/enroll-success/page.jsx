import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { sendEmails } from '@/lib/emails';
import { getCourseDetails } from '@/queries/courses.queries';
import { addEnrollment, getEnrollmentInfo } from '@/queries/enrollment.queries';
import { getUserByEmail } from '@/queries/user.queries';
import { stripe } from '@/service/stripe';
import { CircleCheck } from 'lucide-react';
import Link from 'next/link';

const EnrollSuccessPage = async ({
  searchParams: { session_id, courseId },
}) => {
  if (!session_id) throw new Error('Invalid session id.');

  const session = await auth();
  const course = await getCourseDetails(courseId);
  const user = await getUserByEmail(session?.user?.email);

  const customerName = `${user?.firstName} ${user?.lastName}`;
  const customerEmail = session?.user?.email;
  const courseTitle = course?.title;

  const IsAlreadyEnrolled = await getEnrollmentInfo({
    course: course?.id,
    student: user?.id,
  });

  const teacherName = `${course?.instructor?.firstName} ${course?.instructor?.lastName}`;
  const teacherEmail = course?.instructor?.email;

  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  const paymentIntent = checkoutSession.payment_intent;
  const paymentStatus = paymentIntent.status;

  if (paymentStatus === 'succeeded' && !IsAlreadyEnrolled) {
    // Update DB
    await addEnrollment({
      course: course?.id,
      student: user?.id,
    });

    // Send mail to teacher, student, and the person whose card is used
    const emailsToSend = [
      // Customer info
      {
        to: customerEmail,
        subject: `${courseTitle} course purchase successful`,
        message: `Hello, ${customerName}! You have successfully purchased ${courseTitle}. Please enjoy the content from our website.`,
      },

      // Teacher info
      {
        to: teacherEmail,
        subject: `Someone purchased ${courseTitle} course`,
        message: `
        <p>Hello, ${teacherName}. This message is to inform you that a student purchased.</p>
        <p>
          Student info:<br/>
          Name: <strong>${customerName}</strong><br/>
          Email: <strong>${customerEmail}</strong>
        </p>
        `,
      },
    ];

    await sendEmails(emailsToSend);
  }

  return (
    <div className='h-full w-full flex-1 flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center gap-6 max-w-[750px] text-center'>
        {paymentStatus === 'succeeded' && (
          <>
            <CircleCheck className='w-32 h-32 bg-emerald-700 rounded-full p-0 text-green-600' />
            <h1 className='text-xl md:text-2xl lg:text-3xl'>
              Congratulations, <strong>{customerName}</strong>! Your Enrollment
              was Successful for <strong>{courseTitle}</strong>.
            </h1>
          </>
        )}
        <div className='flex items-center gap-3'>
          <Button asChild size='sm'>
            <Link href='/courses'>Browse Courses</Link>
          </Button>
          <Button asChild variant='outline' size='sm'>
            <Link href={`/courses/${course?.id}/lesson`}>Play Course</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default EnrollSuccessPage;
