'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const DashboardCharts = ({ courseStats, revenueByMonth }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
      <Card>
        <CardHeader>
          <CardTitle>Enrollments by Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={courseStats} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='name' tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => value.substring(0, 10) + '...'} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#ffffff', color: '#000000' }} />
                <Bar dataKey='enrollments' fill='#0ea5e9' radius={[4, 4, 0, 0]} name='Enrollments' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='name' tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12, color: '#000000' }} />
                <Line type='bump' dataKey='revenue' stroke='#10b981' strokeWidth={3} activeDot={{ r: 6 }} name='Revenue ($)' />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
