'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { createLesson, reorderLessons } from '@/app/actions/lesson';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { LessonList } from './lesson-list';
import { LessonModal } from './lesson-modal';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

export const LessonForm = ({ moduleId, initialLessons = [] }) => {
  const [lessons, setLessons] = useState(initialLessons);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const router = useRouter();

  const toggleCreating = () => setIsCreating((prev) => !prev);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      const result = await createLesson(moduleId, { title: values.title });

      if (result.success) {
        setLessons((prev) => [...prev, result.lesson]);
        toast.success('Lesson created');
        form.reset();
        toggleCreating();
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create lesson');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onReorder = async (updateData) => {
    try {
      setIsUpdating(true);
      const result = await reorderLessons(updateData);

      if (result.success) {
        toast.success('Lessons reordered');
        router.refresh();
      } else {
        toast.error(result.error || 'Reorder failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id) => {
    setEditingLessonId(id);
    setIsEditing(true);
  };

  const onLessonUpdate = (updatedLesson) => {
    if (updatedLesson.deleted) {
      setLessons((prev) => prev.filter((l) => l._id !== updatedLesson._id));
      return;
    }
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson._id === updatedLesson._id
          ? { ...lesson, ...updatedLesson }
          : lesson,
      ),
    );
  };

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
      {/* Loading overlay while reordering */}
      {isUpdating && (
        <div className='absolute h-full w-full bg-gray-500/20 top-0 right-0 rounded-md flex items-center justify-center z-10'>
          <Loader2 className='animate-spin h-6 w-6 text-sky-700' />
        </div>
      )}

      <div className='font-medium flex items-center justify-between'>
        Module Lessons
        <Button variant='ghost' onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a lesson
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the module...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type='submit'>
              {isSubmitting ? (
                <Loader2 className='h-4 w-4 animate-spin mr-2' />
              ) : null}
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2',
            !lessons?.length && 'text-slate-500 italic',
          )}
        >
          {!lessons?.length && 'No lessons yet'}
          <LessonList onEdit={onEdit} onReorder={onReorder} items={lessons} />
        </div>
      )}

      {!isCreating && (
        <p className='text-xs text-muted-foreground mt-4'>
          Drag & Drop to reorder the lessons
        </p>
      )}

      <LessonModal
        open={isEditing}
        setOpen={setIsEditing}
        lessonId={editingLessonId}
        onLessonUpdate={onLessonUpdate}
      />
    </div>
  );
};
