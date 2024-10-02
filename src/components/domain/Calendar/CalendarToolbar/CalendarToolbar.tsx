import Heading3 from '@/components/typography/Heading3/Heading3'
import { Button } from '@/components/ui/button'
import { useIsFetching } from '@tanstack/react-query'
import { useParams, useSearch } from '@tanstack/react-router'
import { addMonths, format, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { ToolbarProps } from 'react-big-calendar'

const CalendarToolbar = ({
  date,
  view,
  onView,
  onNavigate,
  ...props
}: ToolbarProps) => {
  const params = useParams({
    from: '/projects/$projectId/schedules/$scheduleId/events/',
  })

  const search = useSearch({
    from: '/projects/$projectId/schedules/$scheduleId/events/',
  })

  const isFetching =
    useIsFetching({
      queryKey: [
        'projects',
        params.projectId,
        'schedules',
        params.scheduleId,
        'events',
      ],
    }) > 0

  useEffect(() => {
    if (search.startAt && search.endAt) return
    onView(view)
  }, [search.startAt, search.endAt, view, onView])

  return (
    <div className='flex items-center justify-between gap-x-2 mb-4' {...props}>
      <div className='flex items-center gap-x-2 flex-shrink-0'>
        <Heading3>
          <span className='inline text-xl sm:hidden'>
            {format(date, 'MMM')}
          </span>
          <span className='hidden sm:inline'>{format(date, 'MMMM')}</span>{' '}
          <span className='text-xl font-normal sm:text-2xl'>
            {format(date, 'yyyy')}
          </span>
        </Heading3>
        {isFetching && (
          <LoaderCircle className='size-4 text-muted-foreground animate-spin' />
        )}
      </div>
      <div className='flex items-center gap-x-2'>
        <Button size='sm' variant='outline' onClick={() => onNavigate('PREV')}>
          <ChevronLeft className='size-4' />
          <span className='hidden sm:inline'>
            {format(subMonths(date, 1), 'MMM')}
          </span>
        </Button>
        <Button size='sm' variant='outline' onClick={() => onNavigate('TODAY')}>
          Today
        </Button>
        <Button size='sm' variant='outline' onClick={() => onNavigate('NEXT')}>
          <span className='hidden sm:inline'>
            {format(addMonths(date, 1), 'MMM')}
          </span>
          <ChevronRight className='size-4' />
        </Button>
      </div>
    </div>
  )
}

export default CalendarToolbar
