import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getCourseInstructorStats } from '@/queries/courses.queries';
import { MessageSquare, Presentation, Star, UsersRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CourseInstructor = async ({ instructor }) => {
  const instructorStats = await getCourseInstructorStats(instructor._id);

  const fullName = `${instructor?.firstName} ${instructor?.lastName}`;
  return (
    <div className='bg-muted rounded-md p-8'>
      <div className='md:flex md:gap-x-5 mb-8'>
        <div className='h-[310px] w-[270px] max-w-full  flex-none rounded mb-5 md:mb-0'>
          <Image src={instructor?.profilePicture} alt='' className='w-full h-full object-cover rounded' width={310} height={270} />
        </div>
        <div className='flex-1'>
          <div className='max-w-[300px]'>
            <h4 className='text-[34px] font-bold leading-[51px]'>{fullName}</h4>
            <div className='text-muted-foreground font-medium mb-6'>{instructor?.designation}</div>
            <ul className='list space-y-4'>
              <li className='flex items-center space-x-3'>
                <Presentation className='text-muted-foreground' />
                <div>{instructorStats?.courses?.length ?? 0} Courses</div>
              </li>
              <li className='flex space-x-3'>
                <UsersRound className='text-muted-foreground' />
                <div>{instructorStats?.students} Student Learned</div>
              </li>
              <li className='flex space-x-3'>
                <MessageSquare className='text-muted-foreground' />
                <div>{instructorStats?.reviewsCount} Reviews</div>
              </li>
              <li className='flex space-x-3'>
                <Star className='text-muted-foreground' />
                <div>{instructorStats?.averageReviews} Average Rating</div>
              </li>
            </ul>
            <Link href={`/inst-profile?instructorId=${instructor?._id}`} className={cn('mt-5', buttonVariants({ size: 'lg' }))}>
              See Profile
            </Link>
          </div>
        </div>
      </div>
      <p className='text-muted-foreground'>{instructor?.bio}</p>
    </div>
  );
};

export default CourseInstructor;
