'use client';

import { updateCourseQuizSet } from '@/app/actions/course';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  quizSetId: z.string().min(1),
});

export const QuizSetForm = ({ initialData, courseId, options }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(initialData?.title ?? '');
  const [selectedLabel, setSelectedLabel] = useState(() => {
    const found = options.find((o) => o.id === initialData?.quizSetId);
    return found?.title ?? '';
  });

  const toggleEdit = () => {
    if (!isEditing) {
      form.reset({ quizSetId: initialData?.quizSetId ?? '' });
    }
    setIsEditing((current) => !current);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizSetId: initialData?.quizSetId ?? '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      const result = await updateCourseQuizSet(courseId, values.quizSetId);

      if (result.success) {
        // Find the title of the selected quiz set to display
        const selected = options.find((o) => o.id === values.quizSetId);
        setCurrentTitle(selected?.title ?? '');
        toast.success('Quiz set updated');
        toggleEdit();
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update quiz set');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='mt-6 border bg-gray-50 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Quiz Set
        <Button variant='ghost' onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit Quiz Set
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !currentTitle && 'text-slate-500 italic',
          )}
        >
          {currentTitle || 'No quiz set selected'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='quizSetId'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      value={selectedLabel}
                      onValueChange={(label) => {
                        setSelectedLabel(label);
                        const selected = options.find((o) => o.title === label);
                        if (selected) {
                          form.setValue('quizSetId', selected.id, {
                            shouldValidate: true,
                          });
                        }
                      }}
                    >
                      <ComboboxInput className='w-full focus:outline-none px-2' />
                      <ComboboxContent>
                        <ComboboxList>
                          {options.map((option) => (
                            <ComboboxItem
                              className='py-1.5'
                              key={option.id}
                              value={option.title}
                            >
                              {option.title}
                            </ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
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
