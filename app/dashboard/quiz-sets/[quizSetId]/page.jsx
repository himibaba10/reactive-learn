import AlertBanner from '@/components/alert-banner';
import { getQuizzesFromQuizSet } from '@/queries/quiz.queries';
import { getQuizSetById } from '@/queries/quizset.queries';
import { AddQuizForm } from './_components/add-quiz-form';
import Quiz from './_components/quiz';
import { QuizSetActions } from './_components/quiz-set-actions';
import { TitleForm } from './_components/title-form';

const EditQuizSetPage = async ({ params: { quizSetId } }) => {
  const quizSet = await getQuizSetById(quizSetId);
  const quizes = await getQuizzesFromQuizSet(quizSetId);

  return (
    <>
      {quizSet?.status !== 'active' && (
        <AlertBanner
          label='This quizSet is unpublished. It will not be visible in the course.'
          variant='warning'
        />
      )}
      <div className='p-6'>
        <div className='flex items-center justify-end'>
          <QuizSetActions quizSetId={quizSetId} status={quizSet?.status} />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2  gap-6 mt-16'>
          {/* Quiz List */}
          <div className='max-lg:order-2'>
            <h2 className='text-xl mb-6'>Quiz List</h2>
            {quizSet?.quizIds?.length === 0 && (
              <AlertBanner
                label='No Quiz are in the set, add some using the form above.'
                variant='warning'
                className='rounded mb-6'
              />
            )}
            <div className='space-y-6'>
              {quizes.map((quiz) => (
                <Quiz key={quiz.id} quiz={quiz} quizSetId={quizSetId} />
              ))}
            </div>
          </div>

          {/* Add Quiz Form */}
          <div>
            <div className='flex items-center gap-x-2'>
              <h2 className='text-xl'>Customize your quiz set</h2>
            </div>
            <div className='max-w-[800px]'>
              <TitleForm title={quizSet?.title} quizSetId={quizSetId} />
            </div>

            <div className='max-w-[800px]'>
              <AddQuizForm quizSetId={quizSetId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditQuizSetPage;
