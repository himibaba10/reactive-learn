'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { VideoPlayer } from '@/app/(main)/courses/[id]/lesson/_components/video-player';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { durationToSeconds, secondsToDuration } from '@/lib/duration';
import { getEmbedUrl } from '@/lib/utils';
import { updateLesson } from '@/queries/lesson.queries';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  videoUrl: z
    .url({ message: 'Please enter a valid URL' })
    .min(1, { message: 'Video URL is required' })
    .refine(
      (url) =>
        url.includes('youtube.com/watch') ||
        url.includes('youtu.be/') ||
        url.includes('youtube.com/embed'),
      { message: 'Please enter a valid YouTube URL' },
    ),

  duration: z
    .string()
    .min(1, { message: 'Duration is required' })
    .regex(/^(\d+:)?([0-5]?\d):([0-5]\d)$/, {
      message: 'Use format mm:ss or hh:mm:ss (e.g. 10:30 or 1:10:30)',
    }),
});

export const VideoUrlForm = ({ initialData, lessonId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(initialData?.videoUrl);
  const [currentDuration, setCurrentDuration] = useState(
    initialData?.duration ? secondsToDuration(initialData.duration) : '',
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: currentUrl ?? '',
      duration: currentDuration ?? '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      const embedUrl = getEmbedUrl(values.videoUrl);
      const durationInSeconds = durationToSeconds(values.duration);

      await updateLesson(lessonId, {
        videoUrl: embedUrl,
        duration: durationInSeconds,
      });

      setCurrentUrl(values?.videoUrl);
      setCurrentDuration(values?.duration);
      toast.success('Lesson updated');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Video URL
        <Button variant='ghost' onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit URL
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          <p className='text-sm mt-2'>{currentUrl}</p>
          <div className='mt-6'>
            {currentUrl ? (
              <VideoPlayer videoUrl={currentUrl} />
            ) : (
              'Add a video URL to preview it.'
            )}
          </div>
        </>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            {/* url */}
            <FormField
              control={form.control}
              name='videoUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type='url'
                      placeholder="e.g. 'youtube.com'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* duration */}
            <FormField
              control={form.control}
              name='duration'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Duration</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. '10:30:18'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
