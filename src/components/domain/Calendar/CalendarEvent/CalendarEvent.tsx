import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/modules/common'
import { COLOR_VARIANTS } from '@/modules/event'
import { GetEventsResponseBody } from '@/services/event'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useSearch } from '@tanstack/react-router'
import { format, isSameDay } from 'date-fns'
import { Calendar, CalendarClock, Clock, Pencil, Settings } from 'lucide-react'
import { EventProps } from 'react-big-calendar'

const CalendarEvent = ({ title, event }: EventProps) => {
  const params = useParams({
    from: '/projects/$projectId/schedules/$scheduleId/events/',
  })

  const search = useSearch({
    from: '/projects/$projectId/schedules/$scheduleId/events/',
  })

  const queryClient = useQueryClient()

  const getEventsQuery = queryClient.getQueryData<GetEventsResponseBody>([
    'projects',
    params.projectId,
    'schedules',
    params.scheduleId,
    'events',
    search,
  ])!

  const { color } = getEventsQuery.content.find(({ id }) => id === event.id)!

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn('h-7 w-full justify-start', COLOR_VARIANTS[color])}
          size='sm'
        >
          <span className='truncate'>{title}</span>
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
                    {format(event.start, 'HH:mm')} -{' '}
                    {format(event.end, 'HH:mm')}
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
                    {format(event.start, 'E d MMM HH:mm')} -{' '}
                    {format(event.end, 'E d MMM HH:mm')}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </PopoverContent>
      )}
    </Popover>
  )
}

export default CalendarEvent
