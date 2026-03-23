'use client';

import { deleteQuizSet, togglePublishQuizSet } from '@/app/actions/quiz-set';
import { CourseActions } from '@/app/dashboard/courses/[courseId]/_components/course-action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const QuizSetActions = ({ quizSetId, status }) => {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePublish = async () => {
    try {
      setIsLoading(true);
      const result = await togglePublishQuizSet(quizSetId, currentStatus);

      if (result.success) {
        setCurrentStatus(result.status);
        toast.success(
          result.status === 'active'
            ? 'Quiz set published'
            : 'Quiz set unpublished',
        );
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update quiz set');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const result = await deleteQuizSet(quizSetId);

      if (result.success) {
        toast.success('Quiz set deleted');
        router.push('/dashboard/quiz-sets'); // 👈 redirect after delete
      } else {
        toast.error(result.error || 'Failed to delete quiz set');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CourseActions
      title='QuizSet'
      isPublished={currentStatus === 'active'}
      onTogglePublish={handleTogglePublish}
      onDelete={handleDelete}
      disabled={isLoading} // 👈 pass loading state
    />
  );
};
