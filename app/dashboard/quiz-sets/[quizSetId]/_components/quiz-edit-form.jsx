// components/QuizEditForm.jsx
'use client';

import { updateQuiz } from '@/app/actions/quiz';
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
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const optionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  is_correct: z.boolean().default(false),
});

const formSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  description: z.string().min(1, 'Description is required'),
  explanations: z.string().min(1, 'Explanation is required'),
  mark: z.coerce.number().min(0, 'Mark must be 0 or more'),
  options: z
    .array(optionSchema)
    .min(2, 'At least 2 options required')
    .refine((opts) => opts.some((o) => o.is_correct), {
      message: 'At least one option must be correct',
    }),
});

export const QuizEditForm = ({ quiz, onCancel, onUpdate }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: quiz.question,
      description: quiz.description,
      explanations: quiz.explanations,
      mark: quiz.mark,
      options: quiz.options,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      const result = await updateQuiz(quiz._id, values);
      if (result.success) {
        toast.success('Quiz updated');
        onUpdate({ ...quiz, ...values });
        onCancel();
      } else {
        toast.error(result.error || 'Failed to update quiz');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {/* Question */}
        <FormField
          control={form.control}
          name='question'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input placeholder='Enter question...' {...field} />
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
                <Textarea placeholder='Enter description...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Options */}
        <div className='space-y-2'>
          <p className='text-sm font-medium'>Options</p>
          {fields.map((fieldItem, index) => (
            <div key={fieldItem.id} className='flex items-center gap-2'>
              {/* is_correct checkbox */}
              <FormField
                control={form.control}
                name={`options.${index}.is_correct`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* option text */}
              <FormField
                control={form.control}
                name={`options.${index}.text`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input placeholder={`Option ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          {/* global options error (e.g. no correct option) */}
          {form.formState.errors.options?.root && (
            <p className='text-sm text-destructive'>
              {form.formState.errors.options.root.message}
            </p>
          )}
        </div>

        {/* Explanation */}
        <FormField
          control={form.control}
          name='explanations'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Explain the correct answer...'
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
                <Input type='number' min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center gap-2'>
          <Button type='submit' disabled={!isValid || isSubmitting} size='sm'>
            Save
          </Button>
          <Button type='button' variant='ghost' size='sm' onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
