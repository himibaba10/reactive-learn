'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const FilterCourse = ({ categories = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentCategoryIds = useMemo(() => {
    return searchParams.get('categories')?.split(',')?.filter(Boolean) || [];
  }, [searchParams]);

  const [filterState, setFilterState] = useState({
    categories: [],
  });

  useEffect(() => {
    setFilterState({
      categories: currentCategoryIds,
    });
  }, [currentCategoryIds]);

  const applyArrayFilter = (type, value) => {
    const currentValues = filterState[type] || [];
    let newValues;

    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v) => v !== value);
    } else {
      newValues = [...currentValues, value];
    }

    setFilterState((prev) => ({
      ...prev,
      [type]: newValues,
    }));

    // Update URL params
    const params = new URLSearchParams(searchParams);

    if (newValues.length > 0) {
      params.set(type, newValues.join(','));
    } else {
      params.delete(type);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const isChecked = (type, value) => {
    return filterState[type]?.includes(value) || false;
  };

  return (
    <div className='hidden lg:block'>
      <Accordion defaultValue={['categories']} type='multiple'>
        {/* Categories filter */}
        <AccordionItem value='categories'>
          <AccordionTrigger className='py-3 text-sm text-gray-400 hover:text-gray-500'>
            <span className='font-medium text-gray-900'>
              Categories ({categories?.length})
            </span>
          </AccordionTrigger>

          <AccordionContent className='pt-6 animate-none'>
            <ul className='space-y-4'>
              {categories.map((category) => (
                <li key={category._id} className='flex items-center'>
                  <Checkbox
                    id={`category-${category._id}`}
                    onCheckedChange={() =>
                      applyArrayFilter('categories', category._id)
                    }
                    checked={isChecked('categories', category._id)}
                  />
                  <label
                    htmlFor={`category-${category._id}`}
                    className='ml-3 text-sm text-gray-600 cursor-pointer flex-1 truncate'
                  >
                    {category.title}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterCourse;
