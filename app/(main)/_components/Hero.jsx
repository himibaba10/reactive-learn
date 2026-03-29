import { auth } from '@/auth';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const Hero = async () => {
  const session = await auth();
  return (
    <section className='relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden'>
      {/* Background Image */}
      <div 
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      {/* Dark Overlay */}
      <div className='absolute inset-0 bg-black/60 z-0' />

      {/* Content */}
      <div className='container relative z-10 flex flex-col items-center justify-center text-center gap-6 px-4 py-20 mt-10'>
        <span className='rounded-full bg-primary/30 text-primary-foreground border border-primary/40 backdrop-blur-md px-6 py-2 text-sm font-medium shadow-2xl tracking-wide'>
          Hey, Welcome to Reactive Learn
        </span>
        <h1 className='font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl text-white max-w-4xl drop-shadow-lg'>
          Learn Today, Lead The Future.
        </h1>
        <p className='max-w-[42rem] mx-auto leading-relaxed text-slate-200 sm:text-xl sm:leading-8 drop-shadow'>
          “You don’t understand anything until you learn it more than one way.” Discover a world of knowledge with our premium interactive learning platform.
        </p>
        <div className='flex items-center gap-4 flex-wrap justify-center mt-8'>
          <Link href='/courses' className={cn(buttonVariants({ size: 'lg' }), 'shadow-xl px-8')}>
            Explore Now
          </Link>
          {!session?.user && (
            <Link
              href='/register/instructor'
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'bg-background/10 text-white border-white/20 hover:bg-background/20 hover:text-white backdrop-blur-sm shadow-xl px-8')}
            >
              Become An Instructor
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
