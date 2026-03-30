'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const SearchCourse = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const searchTerm = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(searchTerm);

  // Debounced search (300ms delay)
  const debouncedSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  return (
    <div className='relative h-10 max-lg:w-full'>
      <Search className='absolute left-2 top-[45%] transform -translate-y-1/2 text-muted-foreground z-10 h-4 w-4' />
      <Input type='text' placeholder='Search courses...' value={inputValue} onChange={handleSearch} className='pl-8 pr-3 py-2 text-sm' />
    </div>
  );
};

export default SearchCourse;
