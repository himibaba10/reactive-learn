import { getReviewsForCourse } from '@/queries/review.queries';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

const ReviewsPage = async ({ params: { courseId } }) => {
  let reviews = await getReviewsForCourse(courseId);
  reviews = reviews.map((review) => ({
    ...review,
    fullName: `${review?.user?.firstName} ${review?.user?.lastName}`,
  }));
  return (
    <div className='p-6'>
      <h2>{reviews?.courseId?.title}</h2>
      <DataTable columns={columns} data={reviews} />
    </div>
  );
};

export default ReviewsPage;
