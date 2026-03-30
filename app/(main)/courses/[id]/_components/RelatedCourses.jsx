import { SectionTitle } from '@/components/section-title';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getRelatedCourses } from '@/queries/courses.queries';
import CourseCard from '../../_components/CourseCard';

const RelatedCourses = async ({ courseId, categoryId }) => {
  const courses = await getRelatedCourses(courseId, categoryId);

  if (!courses || courses.length === 0) return null;

  return (
    <section className=''>
      <div className='container'>
        <SectionTitle className='mb-6'>Related Courses</SectionTitle>
        <Carousel
          opts={{
            align: 'start',
          }}
          className='max-2xl:w-[90%] w-full mx-auto'
        >
          <CarouselPrevious />
          <CarouselNext />
          <CarouselContent>
            {courses.map((course) => {
              return (
                <CarouselItem key={course.id} className='md:basis-1/2 lg:basis-1/3'>
                  <CourseCard course={course} />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default RelatedCourses;
