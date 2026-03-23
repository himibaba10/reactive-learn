import { getQuizSets } from '@/queries/quizset.queries';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

export default async function QuizSets() {
  const quizSets = await getQuizSets();
  return (
    <div className='p-6'>
      <DataTable columns={columns} data={quizSets} />
    </div>
  );
}
