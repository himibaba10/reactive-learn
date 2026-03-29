'use client';

import { updateQuizSet } from '@/app/actions/quiz-set';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
});

export const TitleForm = ({ title, quizSetId }) => {
  const router = useRouter();
  const [currentTitle, setCurrentTitle] = useState(title ?? '');
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    if (!isEditing) {
      form.reset({ title: currentTitle });
    }
    setIsEditing((current) => !current);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: currentTitle,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      const result = await updateQuizSet(quizSetId, values);
      if (result.success) {
        toast.success('QuizSet title updated');
        setCurrentTitle(values.title);
        toggleEdit();
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update quiz');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='mt-6 border bg-muted rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Quiz set title
        <Button variant='ghost' onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit Title
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className='text-sm mt-2'>{currentTitle}</p>}
      {isEditing && (
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
                      placeholder="e.g. 'Advanced web development'"
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
