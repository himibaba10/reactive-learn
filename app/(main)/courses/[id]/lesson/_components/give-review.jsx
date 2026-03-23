'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ReviewModal } from './review-modal';

export const GiveReview = ({ courseId, hasReviewed }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setIsReviewModalOpen(true)}
        variant='outline'
        className='w-full mt-6'
        disabled={hasReviewed}
      >
        {hasReviewed ? 'You already gave a review' : 'Give Review'}
      </Button>
      {!hasReviewed && (
        <ReviewModal
          open={isReviewModalOpen}
          setOpen={setIsReviewModalOpen}
          courseId={courseId}
        />
      )}
    </>
  );
};
