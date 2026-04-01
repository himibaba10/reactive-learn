import { BrainCircuit, FlaskConical, MonitorPlay, Users } from 'lucide-react';

const highlights = [
  {
    name: 'Best Stimulations',
    icon: BrainCircuit,
  },
  {
    name: 'Group Seminars',
    icon: Users,
  },
  {
    name: 'Analysed Syllabus',
    icon: FlaskConical,
  },
  {
    name: 'Practical Training',
    icon: MonitorPlay,
  },
];

const HomeHighlights = () => {
  return (
    <section className='w-full bg-secondary/5 py-12 border-y border-border'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-wrap items-center justify-center gap-12 md:gap-24 lg:gap-32'>
          {highlights.map((item, index) => (
            <div key={index} className='flex flex-col items-center group cursor-pointer'>
              {/* Circular Icon Container */}
              <div className='w-[120px] h-[120px] rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-md group-hover:bg-primary/20 dark:group-hover:bg-primary/30'>
                <item.icon className='w-12 h-12 text-primary' strokeWidth={1.5} />
              </div>
              {/* Text Label */}
              <span className='text-foreground font-medium text-[15px] max-w-[150px] text-center transition-colors group-hover:text-primary'>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHighlights;
