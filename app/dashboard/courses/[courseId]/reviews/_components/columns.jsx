'use client';

import StarRating from '@/components/star-rating';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const columns = [
  {
    id: 'name',
    accessorKey: 'fullName',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Student Name <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rating <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className='flex gap-0.5'>
          <StarRating rating={row.getValue('rating')} />
        </span>
      );
    },
  },
  {
    accessorKey: 'content',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Review <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
];
