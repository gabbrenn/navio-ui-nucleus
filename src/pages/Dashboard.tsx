import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, BookOpen } from 'lucide-react';

const dashboardCards = [
  {
    title: 'Revenue',
    amount: 'KES 452,318.89',
    subtitle: '+20.1% from last month',
    icon: <DollarSign className='h-4 w-4 text-muted-foreground' />,
  },
  {
    title: 'Lessons Completed',
    amount: '+1,234',
    subtitle: '+19% from last month',
    icon: <BookOpen className='h-4 w-4 text-muted-foreground' />,
  },
];

export default function Dashboard() {
  return (
    <div className='space-y-4'>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {dashboardCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{card.amount}</div>
              <p className='text-xs text-muted-foreground'>{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
