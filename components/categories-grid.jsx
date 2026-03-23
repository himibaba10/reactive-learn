import { getCategories } from '@/queries/categories.queries';
import Image from 'next/image';
import Link from 'next/link';

const CategoriesGrid = async () => {
  const categories = await getCategories();
  return (
    <div className='mx-auto grid justify-center gap-4 grid-cols-2  md:grid-cols-3 2xl:grid-cols-4'>
      {categories.map((category) => {
        return (
          <Link
            href={`/courses?categories=${category?._id}`}
            key={category.id}
            className='relative overflow-hidden rounded-lg border bg-background p-2 hover:scale-105 transition-all duration-500 ease-in-out'
          >
            <div className='flex  flex-col gap-4 items-center justify-between rounded-md p-6'>
              <Image
                src={`/assets/images/categories/${category.thumbnail}`}
                alt={category.title}
                width={100}
                height={100}
              />
              <h3 className='font-bold'>{category.title}</h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoriesGrid;
