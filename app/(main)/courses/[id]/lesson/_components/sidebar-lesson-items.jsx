import { cn } from '@/lib/utils';
import { CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';

export const SidebarLessonItem = ({
  lesson,
  isCompleted,
  isActive,
  courseId,
  moduleId,
}) => {
  const isLocked = lesson?.access === 'private';

  if (isLocked) {
    return (
      <div className='flex items-center gap-x-2 text-slate-400 text-sm font-[500] cursor-not-allowed select-none'>
        <div className='flex items-center gap-x-2'>
          <Lock size={16} className='text-slate-400' />
          {lesson?.title}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/courses/${courseId}/lesson?name=${lesson?.slug}&module=${moduleId}`}
      className={cn(
        'flex items-center gap-x-2 text-slate-500 text-sm font-[500] transition-all hover:text-slate-600 p-2 rounded-md',
        isActive && 'text-slate-700 hover:text-slate-700 bg-gray-100',
        isCompleted && 'text-emerald-700 hover:text-emerald-700',
      )}
    >
      <div className='flex items-center gap-x-2'>
        <CheckCircle
          size={16}
          className={cn(
            'text-slate-500',
            isActive && 'text-slate-700',
            isCompleted && 'text-emerald-700',
          )}
        />
        {lesson?.title}
      </div>
    </Link>
  );
};
