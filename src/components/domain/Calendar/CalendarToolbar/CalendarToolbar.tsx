import Heading3 from '@/components/typography/Heading3/Heading3'
import { Button } from '@/components/ui/button'
import { addMonths, format, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { ToolbarProps } from 'react-big-calendar'

const CalendarToolbar = ({
  date,
  onView,
  onNavigate,
  ...props
}: ToolbarProps) => {
  useEffect(() => {
    onView(props.view)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex items-center justify-between gap-x-2 mb-4' {...props}>
      <Heading3>
        {format(date, 'MMMM')}{' '}
        <span className='font-normal'>{format(date, 'yyyy')}</span>
      </Heading3>
      <div className='flex items-center gap-x-2'>
        <Button size='sm' variant='outline' onClick={() => onNavigate('PREV')}>
          <ChevronLeft className='size-4' />
          {format(subMonths(date, 1), 'MMM')}
        </Button>
        <Button size='sm' variant='outline' onClick={() => onNavigate('TODAY')}>
          Today
        </Button>
        <Button size='sm' variant='outline' onClick={() => onNavigate('NEXT')}>
          {format(addMonths(date, 1), 'MMM')}
          <ChevronRight className='size-4' />
        </Button>
      </div>
    </div>
  )
}

export default CalendarToolbar
