'use client';

import { deleteQuiz } from '@/app/actions/quiz';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Circle, CircleCheck, Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { QuizEditForm } from './quiz-edit-form';

const Quiz = ({ quiz: initialQuiz, quizSetId }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [quiz, setQuiz] = useState(initialQuiz);
  const [isDeleting, setIsDeleting] = useState(false); // 👈 loading state

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteQuiz(quizSetId, quiz._id);
      if (result.success) {
        toast.success('Quiz deleted successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete quiz');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='bg-muted shadow-md p-4 lg:p-6 rounded-md border'>
      {isEditing ? (
        <QuizEditForm quiz={quiz} onCancel={() => setIsEditing(false)} onUpdate={(updated) => setQuiz(updated)} />
      ) : (
        <>
          <h2 className='mb-3'>{quiz.question}</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {quiz.options.map((option) => (
              <div className={cn('py-1.5 rounded-sm text-sm flex items-center gap-1 text-gray-600')} key={option.text}>
                {option.is_correct ? <CircleCheck className='size-4 text-emerald-500' /> : <Circle className='size-4' />}
                <p className='text-muted-foreground'>{option.text}</p>
              </div>
            ))}
          </div>
          <div className='flex items-center justify-end gap-2 mt-6'>
            <Button variant='ghost' size='sm' onClick={() => setIsEditing(true)}>
              <Pencil className='w-3 mr-1' /> Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size='sm' className='text-destructive' variant='ghost' disabled={isDeleting}>
                  <Trash className='w-3 mr-1' /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Quiz?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone. This will permanently delete this quiz.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className='bg-destructive'>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
