import { auth } from '@/auth';
import HeroCarousel from './HeroCarousel';

const Hero = async () => {
  const session = await auth();
  return <HeroCarousel session={session} />;
};

export default Hero;
