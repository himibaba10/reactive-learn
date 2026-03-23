'use client';
const quizes = [
  {
    id: 'quiz-1',
    title: 'Quiz title 1',
    description: 'Quiz description',
    options: [
      { label: 'Option-1', id: 1, isCorrect: true },
      { label: 'Option-2', id: 2, isCorrect: false },
      { label: 'Option-3', id: 3, isCorrect: false },
      { label: 'Option-4', id: 4, isCorrect: true },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Quiz title 2',
    description: 'Quiz description',
    options: [
      { label: 'Quiz-2 Option-1', id: 1, isCorrect: true },
      { label: 'Quiz-2 Option-2', id: 2, isCorrect: false },
      { label: 'Quiz-2 Option-3', id: 3, isCorrect: false },
      { label: 'Quiz-2 Option-4', id: 4, isCorrect: true },
    ],
  },
];

function VideoDescription({ description }) {
  return (
    <div className='mt-4'>
      <p className='underline mb-3'>Description</p>
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
}

export default VideoDescription;
