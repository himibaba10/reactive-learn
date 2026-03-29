import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Radio } from 'lucide-react';

const lives = [
  {
    id: 1,
    title: "Career In Backend Web Development",
    date: "10 Nov 2022",
    time: "10:00 AM",
  },
  {
    id: 2,
    title: "Career In Frontend Development",
    date: "10 Nov 2022",
    time: "08:30 PM",
  },
];

const LivesPage = async () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight flex items-center gap-2'>
            <Radio className='w-8 h-8 text-emerald-600' />
            Live Sessions
          </h1>
          <p className='text-muted-foreground mt-2'>
            Manage your live classrooms and upcoming webinars.
          </p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
          <Link href="/dashboard/lives/create">
            <PlusCircle className="mr-2 w-4 h-4" />
            New Live
          </Link>
        </Button>
      </div>
      
      <div className="bg-background border rounded-xl shadow-sm p-4">
        <DataTable columns={columns} data={lives} />
      </div>
    </div>
  );
};

export default LivesPage;
