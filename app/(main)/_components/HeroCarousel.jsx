'use client';

import { buttonVariants } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    badge: 'Hey, Welcome to Reactive Learn',
    heading: 'Learn Today, Lead The Future.',
    subtext: '"You don\'t understand anything until you learn it more than one way." Discover a world of knowledge with our premium interactive learning platform.',
  },
  {
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    badge: 'Expert-Led Courses',
    heading: 'Build Skills That Matter.',
    subtext: 'Learn from world-class instructors and gain real-world experience through hands-on projects and interactive lessons.',
  },
  {
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    badge: 'Community of Learners',
    heading: 'Grow Together, Succeed Together.',
    subtext: 'Join thousands of students on a shared journey of discovery. Collaborate, share, and accelerate your learning with a vibrant community.',
  },
];

const HeroCarousel = ({ session }) => {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  const [api, setApi] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // animKey forces the class to remount → CSS animation restarts
  const [animKey, setAnimKey] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
    setAnimKey((k) => k + 1); // bump key → forces DOM remount of zoom div
  }, [api]);

  useEffect(() => {
    if (!api) return;
    api.on('select', onSelect);
    return () => api.off('select', onSelect);
  }, [api, onSelect]);

  return (
    <Carousel plugins={[plugin.current]} opts={{ loop: true }} setApi={setApi} className='w-full'>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <section className='relative w-full h-[90vh] flex items-center justify-center overflow-hidden'>
              {/* Background Image with Ken Burns zoom — key forces restart on slide change */}
              <div
                key={index === activeIndex ? `active-${animKey}` : `idle-${index}`}
                className={cn('absolute inset-0 z-0 will-change-transform', index === activeIndex && 'hero-bg-zoom')}
                style={{
                  backgroundImage: `url('${slide.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {/* Dark Overlay */}
              <div className='absolute inset-0 bg-black/60 z-0' />

              {/* Content */}
              <div className='container relative z-10 flex flex-col items-center justify-center text-center gap-6 px-4 py-20 mt-10'>
                <span className='rounded-full bg-primary/30 text-primary-foreground border border-primary/40 backdrop-blur-md px-6 py-2 text-sm font-medium shadow-2xl tracking-wide'>
                  {slide.badge}
                </span>
                <h1 className='font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl text-white max-w-7xl drop-shadow-lg'>{slide.heading}</h1>
                <p className='max-w-[47rem] mx-auto leading-relaxed text-slate-200 sm:text-xl sm:leading-8 drop-shadow'>{slide.subtext}</p>
                <div className='flex items-center gap-4 flex-wrap justify-center mt-8'>
                  <Link href='/courses' className={cn(buttonVariants({ size: 'lg' }), 'shadow-xl px-8')}>
                    Explore Now
                  </Link>
                  {!session?.user && (
                    <Link
                      href='/register/instructor'
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'lg' }),
                        'bg-background/10 text-white border-white/20 hover:bg-background/20 hover:text-white backdrop-blur-sm shadow-xl px-8',
                      )}
                    >
                      Become An Instructor
                    </Link>
                  )}
                </div>

                {/* Slide indicators */}
                <div className='flex gap-2 mt-4'>
                  {slides.map((_, i) => (
                    <div key={i} className={cn('h-1.5 rounded-full transition-all duration-500', i === activeIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40')} />
                  ))}
                </div>
              </div>
            </section>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default HeroCarousel;
