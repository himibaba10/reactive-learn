'use client';
import { createQuiz } from '@/app/actions/quiz';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Question is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  explanations: z.string().min(1, { message: 'Explanation is required' }),
  mark: z.coerce.number().min(1, { message: 'Mark must be at least 1' }),
  optionA: z.object({
    label: z.string().min(1, { message: 'Option label is required' }),
    isTrue: z.boolean().default(false),
  }),
  optionB: z.object({
    label: z.string().min(1, { message: 'Option label is required' }),
    isTrue: z.boolean().default(false),
  }),
  optionC: z.object({
    label: z.string().min(1, { message: 'Option label is required' }),
    isTrue: z.boolean().default(false),
  }),
  optionD: z.object({
    label: z.string().min(1, { message: 'Option label is required' }),
    isTrue: z.boolean().default(false),
  }),
});

const defaultValues = {
  title: '',
  description: '',
  explanations: '',
  mark: 1,
  optionA: { label: '', isTrue: false },
  optionB: { label: '', isTrue: false },
  optionC: { label: '', isTrue: false },
  optionD: { label: '', isTrue: false },
};

export const AddQuizForm = ({ quizSetId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      const quizData = {
        question: values.title,
        description: values.description,
        explanations: values.explanations,
        mark: values.mark,
        options: [
          { text: values.optionA.label, is_correct: values.optionA.isTrue },
          { text: values.optionB.label, is_correct: values.optionB.isTrue },
          { text: values.optionC.label, is_correct: values.optionC.isTrue },
          { text: values.optionD.label, is_correct: values.optionD.isTrue },
        ],
      };

      const result = await createQuiz(quizSetId, quizData);

      if (result.success) {
        toast.success('Quiz added successfully');
        form.reset(defaultValues);
        toggleEdit();
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to add quiz');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='mt-6 border bg-muted rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Add New Quiz
        <Button variant='ghost' onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Add Quiz
            </>
          )}
        </Button>
      </div>

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            {/* Quiz Question */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Question</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='Enter quiz question'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder='Enter quiz description'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Explanations */}
            <FormField
              control={form.control}
              name='explanations'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder='Explain the correct answer'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mark */}
            <FormField
              control={form.control}
              name='mark'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mark</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      disabled={isSubmitting}
                      placeholder='e.g. 5'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Options A-D */}
            {['A', 'B', 'C', 'D'].map((opt) => (
              <div key={opt} className='space-y-3'>
                <p className='text-sm font-medium'>Option {opt}</p>
                <div className='flex items-start gap-3'>
                  <FormField
                    control={form.control}
                    name={`option${opt}.isTrue`}
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name={`option${opt}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              disabled={isSubmitting}
                              placeholder={`Enter option ${opt}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className='flex items-center justify-end gap-x-2'>
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
