import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {new Array(fullStars).fill(null).map((_, idx) => (
        <Star
          key={`full-${idx}`}
          width={16}
          height={16}
          color='rgb(202, 138, 4)'
          fill='rgb(202, 138, 4)'
        />
      ))}

      {hasHalfStar && (
        <StarHalf
          key='half'
          width={16}
          height={16}
          color='rgb(202, 138, 4)'
          fill='rgb(202, 138, 4)'
        />
      )}

      {new Array(emptyStars).fill(null).map((_, idx) => (
        <Star
          key={`empty-${idx}`}
          width={16}
          height={16}
          color='rgb(202, 138, 4)'
          fill='none'
        />
      ))}
    </div>
  );
};

export default StarRating;
