'use client';

import { deleteLesson } from '@/app/actions/lesson';
import { IconBadge } from '@/components/icon-badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getLesson, togglePublishLesson } from '@/queries/lesson.queries';
import { ArrowLeft, Eye, LayoutDashboard, Loader2, Video } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CourseActions } from '../../../_components/course-action';
import { LessonAccessForm } from './lesson-access-form';
import { LessonDescriptionForm } from './lesson-description-form';
import { LessonTitleForm } from './lesson-title-form';
import { VideoUrlForm } from './video-url-form';

export const LessonModal = ({ open, setOpen, lessonId, onLessonUpdate }) => {
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!lessonId || !open) return;

    const fetchLesson = async () => {
      setIsLoading(true);
      try {
        const result = await getLesson(lessonId);
        if (result._id) setLesson(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, open]);

  const handleLessonPublish = async () => {
    await togglePublishLesson(lessonId);
    setLesson((prev) => ({ ...prev, published: !prev?.published }));
    onLessonUpdate({ ...lesson, published: !lesson?.published });
    toast.success('Lesson is unpublished.');
  };

  const handleLessonDelete = async () => {
    try {
      const result = await deleteLesson(lessonId);

      if (result.success) {
        toast.success('Lesson deleted successfully');
        onLessonUpdate({ _id: lessonId, deleted: true }); // ← signal parent to remove from list
        setOpen(false); // ← close modal after deletion
      } else {
        toast.error(result.error || 'Failed to delete lesson');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className='hidden'>Edit Lesson</DialogTitle>
      <DialogContent
        aria-describedby={undefined}
        className='sm:max-w-[1200px] w-[96%] overflow-y-auto max-h-[90vh]'
        onInteractOutside={(e) => e.preventDefault()}
      >
        {isLoading ? (
          // Loading state while fetching lesson
          <div className='flex items-center justify-center h-64'>
            <Loader2 className='h-8 w-8 animate-spin text-sky-700' />
          </div>
        ) : (
          <div>
            <div className='flex items-center justify-between'>
              <div className='w-full'>
                <Link
                  href='#'
                  onClick={() => setOpen(false)}
                  className='flex items-center text-sm hover:opacity-75 transition mb-6'
                >
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Back to module setup
                </Link>
                <div className='flex items-center justify-end'>
                  <CourseActions
                    onTogglePublish={handleLessonPublish}
                    onDelete={handleLessonDelete}
                    title='lesson'
                    isPublished={lesson?.published}
                  />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
              <div className='space-y-4'>
                <div>
                  <div className='flex items-center gap-x-2'>
                    <IconBadge icon={LayoutDashboard} />
                    <h2 className='text-xl'>Customize Your Lesson</h2>
                  </div>
                  <LessonTitleForm
                    initialData={{ title: lesson?.title }}
                    lessonId={lessonId}
                    onLessonUpdate={onLessonUpdate}
                  />
                  <LessonDescriptionForm
                    initialData={{ description: lesson?.description }}
                    lessonId={lessonId}
                  />
                </div>
                <div>
                  <div className='flex items-center gap-x-2'>
                    <IconBadge icon={Eye} />
                    <h2 className='text-xl'>Access Settings</h2>
                  </div>
                  <LessonAccessForm
                    initialData={{ access: lesson?.access }}
                    lessonId={lessonId}
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center gap-x-2'>
                  <IconBadge icon={Video} />
                  <h2 className='text-xl'>Add a video</h2>
                </div>
                <VideoUrlForm
                  initialData={{
                    videoUrl: lesson?.videoUrl,
                    duration: lesson?.duration,
                  }}
                  lessonId={lessonId}
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
