'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import useCategories from '@/hooks/use-categories';
import { cn } from '@/lib/utils';
import { updateCourse } from '@/queries/courses.queries';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  category: z.string().min(1),
});

export const CategoryForm = ({ initialData, courseId }) => {
  const { categories } = useCategories();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: initialData?.category || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      await updateCourse(courseId, values);
      toast.success('Course category updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const selectedOptions = categories.find(
    (category) => category.title === initialData.category,
  );

  return (
    <div className='mt-6 border bg-gray-50 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course Category
        <Button variant='ghost' onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit Category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.category && 'text-slate-500 italic',
          )}
        >
          {selectedOptions?.title || 'No category'}
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
              name='category'
              render={({ field }) => (
                <FormItem>
                  <Combobox value={field.value} onValueChange={field.onChange}>
                    <ComboboxInput
                      className={
                        'w-full h-[-webkit-fill-available focus:outline-none px-2'
                      }
                    />
                    <ComboboxContent>
                      <ComboboxList>
                        {categories.map((category) => (
                          <ComboboxItem
                            className={'py-1.5'}
                            key={category.description}
                            value={category.title}
                          >
                            {category.title}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
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
