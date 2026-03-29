import { BookOpen, Users, Video, Award } from "lucide-react";

const features = [
  {
    name: "Interactive Courses",
    description: "Engage with interactive content that makes learning fun and effective.",
    icon: BookOpen,
  },
  {
    name: "Expert Instructors",
    description: "Learn from industry experts who are passionate about teaching.",
    icon: Users,
  },
  {
    name: "High-Quality Video",
    description: "Enjoy high-quality video lessons that bring concepts to life.",
    icon: Video,
  },
  {
    name: "Earn Certificates",
    description: "Earn certificates upon completion to showcase your achievements.",
    icon: Award,
  },
];

const HomeFeatures = () => {
  return (
    <section className="container py-12 lg:py-24 bg-background">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl text-primary">Why Choose Us?</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Discover the benefits of learning with our platform
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, i) => (
          <div key={i} className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
            <div className="h-14 w-14 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-6">
              <feature.icon className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-3">{feature.name}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeFeatures;
