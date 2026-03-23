import Hero from './_components/Hero';
import HomeCategories from './_components/HomeCategories';
import HomeCourses from './_components/HomeCourses';

const HomePage = async () => {
  return (
    <>
      <Hero />
      <HomeCategories />
      <HomeCourses />
    </>
  );
};

export default HomePage;
