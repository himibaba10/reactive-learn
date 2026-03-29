import { getQuizSets } from '@/queries/quizset.queries';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, MessageSquareQuote } from 'lucide-react';

export default async function QuizSets() {
  const quizSets = await getQuizSets();
  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight flex items-center gap-2'>
            <MessageSquareQuote className='w-8 h-8 text-emerald-600' />
            Quiz Sets
          </h1>
          <p className='text-muted-foreground mt-2'>
            Create and manage quiz assessments to attach to your courses.
          </p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
          <Link href="/dashboard/quiz-sets/add">
            <PlusCircle className="mr-2 w-4 h-4" />
            New Quiz Set
          </Link>
        </Button>
      </div>

      <div className="bg-background border rounded-xl shadow-sm p-4">
        <DataTable columns={columns} data={quizSets} />
      </div>
    </div>
  );
}
