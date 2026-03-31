'use client';

import { submitQuizSet } from '@/app/actions/assessment';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useQuiz } from '@/providers/quiz-provider';

export const QuizDialog = () => {
  const { isOpen, setIsOpen, quizData } = useQuiz();
  const { quizSet, quizzes, courseId, userAssessment } = quizData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [viewMode, setViewMode] = useState(false);
  const [assessment, setAssessment] = useState(null);

  const totalQuizzes = quizzes?.length || 0;
  const lastQuizIndex = totalQuizzes - 1;
  const currentQuiz = quizzes?.[quizIndex];
  const totalMark = quizSet?.totalMark || 10;

  useEffect(() => {
    if (isOpen) {
      if (userAssessment) {
        setAssessment(userAssessment);
        setViewMode(true);
      } else {
        setViewMode(false);
        setAssessment(null);
      }
    } else {
      // Reset logic when closed if needed, but let's keep progress for now
      // setQuizIndex(0);
      // setUserAnswers({});
    }
  }, [isOpen, userAssessment]);

  const quizChangeHandler = (type) => {
    if (type === 'next' && quizIndex < lastQuizIndex) {
      setQuizIndex((prev) => prev + 1);
    }
    if (type === 'prev' && quizIndex > 0) {
      setQuizIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await submitQuizSet({
        quizSetId: quizSet._id,
        answers: userAnswers,
        courseId,
      });

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast.success('Quiz submitted successfully!');
      setIsOpen(false);
      setUserAnswers({});
      setQuizIndex(0);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (quizId, optionIndex) => {
    if (viewMode) return;

    setUserAnswers((prev) => {
      const currentQuizAnswers = prev[quizId] || [];
      const newAnswers = currentQuizAnswers.includes(optionIndex)
        ? currentQuizAnswers.filter((idx) => idx !== optionIndex)
        : [...currentQuizAnswers, optionIndex].sort((a, b) => a - b);

      return {
        ...prev,
        [quizId]: newAnswers,
      };
    });
  };

  const getOptionClasses = (option, optionIndex) => {
    if (!viewMode || !assessment) return '';

    const currentAssessment = assessment.assessments.find(
      (a) => a.quizId.toString() === currentQuiz._id.toString(),
    );

    if (!currentAssessment) return '';

    const isSelected = currentAssessment.options[optionIndex]?.isSelected;
    const isCorrect = option.is_correct;

    if (isCorrect && isSelected) {
      return 'bg-green-100 border-green-400 text-green-800';
    } else if (isCorrect && !isSelected) {
      return 'bg-green-200 border-green-400 text-green-800 opacity-75';
    } else if (!isCorrect && isSelected) {
      return 'bg-red-100 border-red-400 text-red-800 line-through';
    }
    return '';
  };

  if (!quizSet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        aria-describedby={undefined}
        className='sm:max-w-[95%] block'
      >
        <DialogTitle className='hidden'>{currentQuiz?.question}</DialogTitle>
        <div className='pb-4 border-b border-border text-sm'>
          <span className='text-success inline-block mr-1'>
            {quizIndex + 1} / {totalQuizzes}
          </span>{' '}
          টি প্রশ্ন
        </div>

        <div className='py-4'>
          <h3 className='text-xl font-medium mb-10'>
            <svg
              className='text-success inline'
              strokeWidth='0'
              viewBox='0 0 512 512'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fill='currentColor'
                stroke='currentColor'
                d='M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z'
              ></path>
            </svg>
            {currentQuiz?.question || 'Quiz Question'}
          </h3>

          <span className='text-[10px] block text-end'>
            <svg
              stroke='currentColor'
              fill='currentColor'
              strokeWidth='0'
              version='1.1'
              viewBox='0 0 16 16'
              className='text-success inline mr-1'
              height='12'
              width='12'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M7 4.75c0-0.412 0.338-0.75 0.75-0.75h0.5c0.412 0 0.75 0.338 0.75 0.75v0.5c0 0.412-0.338 0.75-0.75 0.75h-0.5c-0.412 0-0.75-0.338-0.75-0.75v-0.5z'></path>
              <path d='M10 12h-4v-1h1v-3h-1v-1h3v4h1z'></path>
              <path d='M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z'></path>
            </svg>
            {currentQuiz?.description ||
              'Multiple answers possible, no negative marking'}
          </span>
        </div>

        <div className='grid md:grid-cols-2 gap-5 mb-6 text-foreground'>
          {currentQuiz?.options?.map((option, optionIndex) => {
            return (
              <div key={`${currentQuiz._id}-${optionIndex}`}>
                <input
                  className='opacity-0 invisible absolute [&:checked_+_label]:bg-success/5 [&:checked_+_label]:border-success'
                  type='checkbox'
                  id={`option-${currentQuiz._id}-${optionIndex}`}
                  checked={(userAnswers[currentQuiz._id] || []).includes(
                    optionIndex,
                  )}
                  onChange={() =>
                    handleOptionChange(currentQuiz._id, optionIndex)
                  }
                />
                <Label
                  className={`border rounded px-2 py-3 block cursor-pointer hover:bg-muted transition-all font-normal
                  ${
                    viewMode
                      ? getOptionClasses(option, optionIndex)
                      : '[&:has(input:checked)]:bg-success/5 [&:has(input:checked)]:border-success'
                  }`}
                  htmlFor={`option-${currentQuiz._id}-${optionIndex}`}
                >
                  {option.text}
                </Label>
              </div>
            );
          })}
        </div>

        <DialogFooter className='flex gap-4 justify-between w-full sm:justify-between'>
          <Button
            className='gap-2 rounded-3xl'
            disabled={quizIndex === 0}
            onClick={() => quizChangeHandler('prev')}
            variant='outline'
          >
            <ArrowLeft size={16} /> Previous Quiz
          </Button>

          {quizIndex === lastQuizIndex ? (
            <Button
              className='gap-2 rounded-3xl text-white'
              onClick={handleSubmitQuiz}
              disabled={
                isSubmitting || !(userAnswers[currentQuiz?._id]?.length > 0)
              }
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button
              className='gap-2 rounded-3xl text-white'
              disabled={isSubmitting}
              onClick={() => quizChangeHandler('next')}
            >
              Next Quiz <ArrowRight size={16} />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
