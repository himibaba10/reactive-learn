import Hero from './_components/Hero';
import HomeCategories from './_components/HomeCategories';
import HomeCourses from './_components/HomeCourses';
import HomeFeatures from './_components/HomeFeatures';
import HomeHighlights from './_components/HomeHighlights';
import HomeStats from './_components/HomeStats';
import HomeTestimonials from './_components/HomeTestimonials';

const HomePage = async () => {
  return (
    <>
      <Hero />
      <HomeHighlights />
      <HomeCategories />
      <HomeFeatures />
      <HomeStats />
      <HomeCourses />
      <HomeTestimonials />
    </>
  );
};

export default HomePage;
