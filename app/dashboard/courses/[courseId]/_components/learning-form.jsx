'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateCourse } from '@/queries/courses.queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, X, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  learning: z.array(
    z.object({
      value: z.string().min(1, { message: 'Learning objective cannot be empty' }),
    })
  ),
});

export const LearningForm = ({ initialData = {}, courseId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      learning:
        initialData?.learning?.length > 0
          ? initialData.learning.map((val) => ({ value: val }))
          : [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'learning',
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      const flattenedLearning = values.learning.map((lv) => lv.value);
      await updateCourse(courseId, { learning: flattenedLearning });
      toggleEdit();
      toast.success('Course learning objectives updated');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='mt-6 border bg-muted rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        What will students learn
        <Button variant='ghost' onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit Learning
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <ul className='text-sm mt-2 list-disc list-inside space-y-1'>
          {initialData?.learning?.length > 0 ? (
            initialData.learning.map((learningItem, idx) => (
              <li key={idx} className="text-foreground">{learningItem}</li>
            ))
          ) : (
            <span className='text-muted-foreground italic'>No learning objectives set</span>
          )}
        </ul>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`learning.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex items-center gap-x-2'>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 'Build a React app from scratch'"
                          {...field}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          onClick={() => remove(index)}
                        >
                          <X className='h-4 w-4 text-muted-foreground hover:text-red-500 transition' />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: '' })}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add objective
            </Button>
            
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
