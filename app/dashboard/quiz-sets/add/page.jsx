'use client';
import { createQuizSet } from '@/app/actions/quiz-set';
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
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required!',
  }),
});

export default function AddQuizSet() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
      const result = await createQuizSet(values);

      if (result.success) {
        toast.success('Quiz Set Created');
        router.push(`/dashboard/quiz-sets/${result.data.id}`);
      } else {
        toast.error(result.error || 'Failed to create quiz set');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
      <div className='max-w-full w-[536px]'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 mt-8'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Set Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g 'Reactive Accelerator'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center gap-x-2'>
              <Link href='/dashboard/quiz-sets'>
                <Button variant='outline' type='button'>
                  Cancel
                </Button>
              </Link>
              <Button type='submit' disabled={!isValid || isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Continue'}{' '}
                {/* 👈 loading feedback */}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
