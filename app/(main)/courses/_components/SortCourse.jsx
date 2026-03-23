'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SortCourse() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get('sortBy') || '';

  const SORT_OPTIONS = [
    { label: 'Newest First', value: '-createdAt' },
    { label: 'Oldest First', value: 'createdAt' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Title: A-Z', value: 'title' },
    { label: 'Title: Z-A', value: '-title' },
  ];

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set('sortBy', value);
    } else {
      params.delete('sortBy');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className='w-[180px] border-none !border-b focus:ring-0 focus:ring-offset-0 overflow-hidden'>
        <SelectValue placeholder='Sort By' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort By</SelectLabel>
          {SORT_OPTIONS.map((option) => (
            <SelectItem
              className='cursor-pointer'
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
