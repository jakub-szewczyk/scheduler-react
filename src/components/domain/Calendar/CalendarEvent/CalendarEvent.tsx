import { Button } from '@/components/ui/button'
import { EventProps } from 'react-big-calendar'

const CalendarEvent = ({ title }: EventProps) => (
  <Button
    className='h-7 w-full justify-start bg-teal-600 text-teal-950 hover:bg-teal-600/90'
    size='sm'
  >
    {title}
  </Button>
)

export default CalendarEvent
