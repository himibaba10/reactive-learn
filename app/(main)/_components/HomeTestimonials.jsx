import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Frontend Developer",
    content: "This platform completely changed the way I learn. The courses are structured perfectly and the instructors are amazing.",
    avatar: "SJ"
  },
  {
    name: "David Chen",
    role: "UX Designer",
    content: "The quality of the video lessons is outstanding. I was able to apply what I learned immediately to my job.",
    avatar: "DC"
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist",
    content: "Getting certified through these courses helped me land my dream job. The interactive exercises are top-notch.",
    avatar: "ER"
  }
];

const HomeTestimonials = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl text-primary">Student Success Stories</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Hear what our students have to say about their experience
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="bg-background border-none shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6">&quot;{testimonial.content}&quot;</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
