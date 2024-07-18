import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format, isSameDay } from 'date-fns'
import { Calendar, CalendarClock, Clock, Pencil, Settings } from 'lucide-react'
import { EventProps } from 'react-big-calendar'

const CalendarEvent = ({ title, event }: EventProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        className='h-7 w-full justify-start bg-teal-600 text-teal-950 hover:bg-teal-600/90'
        size='sm'
      >
        {title}
      </Button>
    </PopoverTrigger>
    {event.start && event.end && (
      <PopoverContent className='w-80' side='right'>
        <dl className='flex flex-col gap-y-2 text-sm'>
          <div className='flex items-center justify-between gap-x-2'>
            <dt className='truncate font-bold'>{event.title}</dt>
            <dd className='flex gap-x-1'>
              <Button className='size-8' size='icon' variant='outline'>
                <Pencil className='size-4' />
              </Button>
              <Button className='size-8' size='icon' variant='outline'>
                <Settings className='size-4' />
              </Button>
            </dd>
          </div>
          {isSameDay(event.start, event.end) ? (
            <div className='flex gap-x-2'>
              <div className='flex items-center gap-x-2'>
                <dt>
                  <Calendar className='size-4' />
                </dt>
                <dd>{format(event.start, 'E d MMM')}</dd>
              </div>
              <div className='flex items-center gap-x-2'>
                <dt>
                  <Clock className='size-4' />
                </dt>
                <dd>
                  {format(event.start, 'kk:mm')} - {format(event.end, 'kk:mm')}
                </dd>
              </div>
            </div>
          ) : (
            <>
              <div className='flex items-center gap-x-2'>
                <dt>
                  <CalendarClock className='size-4' />
                </dt>
                <dd>
                  {format(event.start, 'E d MMM kk:mm')} -{' '}
                  {format(event.end, 'E d MMM kk:mm')}
                </dd>
              </div>
            </>
          )}
        </dl>
      </PopoverContent>
    )}
  </Popover>
)

export default CalendarEvent
