'use client';

import { createContext, useContext, useState } from 'react';

const QuizContext = createContext(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quizData, setQuizData] = useState({
    quizSet: null,
    quizzes: [],
    courseId: null,
    userAssessment: null,
  });

  const openQuiz = (data) => {
    setQuizData(data);
    setIsOpen(true);
  };

  const closeQuiz = () => {
    setIsOpen(false);
  };

  return (
    <QuizContext.Provider value={{ isOpen, setIsOpen, quizData, openQuiz, closeQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};
