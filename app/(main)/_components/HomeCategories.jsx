import CategoriesGrid from '@/components/categories-grid';
import { SectionTitle } from '@/components/section-title';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

const HomeCategories = async () => {
  return (
    <section
      id='categories'
      className='container space-y-6  py-8  md:py-12 lg:py-24'
    >
      <div className='flex items-center justify-between'>
        <SectionTitle>Categories</SectionTitle>

        <Link
          href='/categories'
          className=' text-sm font-medium  hover:opacity-80 flex items-center gap-1'
        >
          Browse All <ArrowRightIcon className='h-4 w-4' />
        </Link>
      </div>
      <CategoriesGrid />
    </section>
  );
};

export default HomeCategories;
