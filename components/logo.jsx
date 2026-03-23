import Link from 'next/link';
export const Logo = ({ className = '' }) => {
  return (
    <Link href={'/'} className='leading-5 text-xl font-bold'>
      Reactive
      <br />
      <span>Learn</span>
    </Link>
  );
};
