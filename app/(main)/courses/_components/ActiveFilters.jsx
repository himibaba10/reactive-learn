'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';

const ActiveFilters = () => {
  const [filter, setFilter] = useState({
    categories: ['development'],
    price: ['free'],
    sort: '',
  });

  //   apply checkbox filter
  const applyArrayFilter = ({ type, value }) => {
    const isFilterApplied = filter[type].includes(value);

    if (isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [type]: prev[type].filter((v) => v !== value),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [type]: [...prev[type], value],
      }));
    }
  };
  return (
    <div className='flex items-center gap-2 flex-wrap'>
      {/* active categories */}
      {filter.categories.length > 0 &&
        filter.categories.map((category) => (
          <Button
            key={category}
            variant='ghost'
            className='text-xs h-7 bg-muted rounded-full gap-1 text-sky-700'
            onClick={() =>
              applyArrayFilter({ type: 'categories', value: category })
            }
          >
            {category}
            <X className='w-3' />
          </Button>
        ))}
      {/* active prices */}
      {filter.price.length > 0 &&
        filter.price.map((price) => (
          <Button
            key={price}
            variant='ghost'
            className='text-xs h-7 bg-muted rounded-full gap-1 text-sky-700'
            onClick={() => applyArrayFilter({ type: 'price', value: price })}
          >
            {price}
            <X className='w-3' />
          </Button>
        ))}
    </div>
  );
};

export default ActiveFilters;
