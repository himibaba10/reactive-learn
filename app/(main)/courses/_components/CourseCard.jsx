import EnrollButton from '@/components/enroll-button';
import { formatPrice } from '@/lib/formatPrice';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CourseCard = ({ course }) => {
  const courseId = course?.id ?? course?._id;

  return (
    <div className='group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border rounded-xl bg-background h-full flex flex-col'>
      <Link href={`/courses/${courseId}`} className='block relative w-full aspect-video overflow-hidden'>
        <Image
          src={`/assets/images/courses/${course?.thumbnail}`}
          alt={course?.title}
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </Link>
      <div className='flex flex-col p-4 flex-1'>
        <div className='font-heading text-lg md:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2'>
          <Link href={`/courses/${courseId}`}>{course?.title}</Link>
        </div>
        <p className='text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded inline-block w-fit mt-2'>{course?.category?.title}</p>
        <div className='my-4 flex items-center gap-x-2 text-sm text-muted-foreground'>
          <div className='flex items-center gap-x-1.5'>
            <div className='p-1.5 rounded-full bg-primary/10 text-primary'>
              <BookOpen className='w-4 h-4' />
            </div>
            <span>{course?.modules?.length} Chapters</span>
          </div>
        </div>

        <div className='flex items-center justify-between mt-auto pt-4 border-t mt-4'>
          <p className='text-lg font-bold text-foreground'>{formatPrice(course?.price)}</p>

          {!course?.enrolled ? (
            <EnrollButton courseId={course?.id} courseTitle={course?.title} coursePrice={course?.price} asLink={true} />
          ) : (
            <Link className='text-sm font-medium text-primary hover:underline' href={`/courses/${courseId}/lesson`}>
              Go to Lesson
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
