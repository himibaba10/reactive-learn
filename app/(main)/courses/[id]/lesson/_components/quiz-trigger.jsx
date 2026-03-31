'use client';

import QuizCard from './quiz-card';
import { useSidebarSheet } from './sidebar-sheet-context';
import { useQuiz } from '@/providers/quiz-provider';

export const QuizTrigger = ({ quizSet, quizzes, courseId, userAssessment }) => {
  const sidebarSheet = useSidebarSheet();
  const { openQuiz } = useQuiz();

  const handleOpenQuiz = () => {
    // Close the mobile sidebar sheet first
    sidebarSheet?.close();

    // Open the global quiz modal
    openQuiz({
      quizSet,
      quizzes,
      courseId,
      userAssessment,
    });
  };

  return (
    <QuizCard
      quizSetTitle={quizSet?.title}
      description={quizSet?.description}
      totalMark={quizSet?.totalMark || 10}
      onBtnClick={handleOpenQuiz}
      buttonText={userAssessment ? 'Check Options' : 'Participate in Quiz'}
    />
  );
};
