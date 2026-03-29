import { cn } from '@/lib/utils';
import { getLesson } from '@/queries/lesson.queries';
import { Tv } from 'lucide-react';

const ModuleLessonList = async ({ lessonId }) => {
  const lesson = await getLesson(lessonId);
  return (
    <button
      type='button'
      className={cn(
        'flex items-center gap-x-2 text-muted-foreground text-sm font-[500]  transition-all hover:text-slate-600  w-full',
      )}
    >
      <div className='flex items-center gap-x-2'>
        <Tv size={16} className={cn('text-muted-foreground')} />
        {lesson?.title}
      </div>
    </button>
  );
};

export default ModuleLessonList;
