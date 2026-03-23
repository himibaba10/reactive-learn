import { getEnrollmentsWithReport } from '@/queries/enrollment.queries';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

const EnrollmentsPage = async ({ params: { courseId } }) => {
  let enrollments = await getEnrollmentsWithReport(courseId);

  return (
    <div className='p-6'>
      <h2>Think in a Redux way enrollments</h2>
      <DataTable columns={columns} data={enrollments} />
    </div>
  );
};

export default EnrollmentsPage;
