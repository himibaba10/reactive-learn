import { getCategories } from '@/queries/categories.queries';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CategoriesGrid = async () => {
  const categories = await getCategories();
  return (
    <div className='mx-auto grid justify-center gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
      {categories.map((category) => {
        return (
          <Link
            href={`/courses?categories=${category?._id}`}
            key={category.id}
            className='group block overflow-hidden rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
          >
            <div className='relative w-full aspect-[16/9] overflow-hidden'>
              <Image
                src={`/assets/images/categories/${category.thumbnail}`}
                alt={category.title}
                fill
                className='object-cover transition-transform duration-500 ease-in-out group-hover:scale-110'
                sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw'
              />
              <div className='absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent' />
            </div>
            
            <div className='p-5 flex items-center justify-between'>
              <h3 className='font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors'>
                {category.title}
              </h3>
              <ArrowUpRight className='w-5 h-5 opacity-0 -ml-5 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0 text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoriesGrid;
