import { myStats } from '@/lib/my-helpers';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

const CoursesPage = async () => {
  const coursesByInstructor = await myStats();
  return (
    <div className='p-6'>
      <DataTable columns={columns} data={coursesByInstructor} />
    </div>
  );
};

export default CoursesPage;
