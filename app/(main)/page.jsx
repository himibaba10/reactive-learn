import Hero from './_components/Hero';
import HomeCategories from './_components/HomeCategories';
import HomeCourses from './_components/HomeCourses';
import HomeFeatures from './_components/HomeFeatures';
import HomeTestimonials from './_components/HomeTestimonials';

const HomePage = async () => {
  return (
    <>
      <Hero />
      <HomeFeatures />
      <HomeCategories />
      <HomeCourses />
      <HomeTestimonials />
    </>
  );
};

export default HomePage;
