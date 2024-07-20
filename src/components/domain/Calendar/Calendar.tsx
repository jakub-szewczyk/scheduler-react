import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { useState } from 'react'
import {
  Calendar as BigCalendar,
  CalendarProps,
  Event,
  dateFnsLocalizer,
} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CalendarEvent from './CalendarEvent/CalendarEvent'
import CalendarToolbar from './CalendarToolbar/CalendarToolbar'

declare module 'react-big-calendar' {
  interface Event {
    id: string
  }
}

const localizer = dateFnsLocalizer({
  parse,
  format,
  getDay,
  locales: { 'en-US': enUS },
  startOfWeek,
})

const Calendar = (props: Omit<CalendarProps, 'localizer'>) => {
  const [date, setDate] = useState<string>()
  const [events, setEvents] = useState<Event[]>([])

  return (
    <div className='h-[600px] [&_.rbc-show-more]:!text-teal-600'>
      <BigCalendar
        {...props}
        localizer={localizer}
        views={{ month: true }}
        doShowMoreDrillDown={false}
        components={{ event: CalendarEvent, toolbar: CalendarToolbar }}
        messages={{
          // @ts-expect-error: should accept JSX.Element
          showMore: (count) => (
            <Popover>
              <PopoverTrigger asChild>
                <span>+{count} more</span>
              </PopoverTrigger>
              <PopoverContent className='space-y-0.5'>
                {date && <div>{format(date, 'EEEE d MMMM')}</div>}
                {events.map((event) => (
                  <CalendarEvent
                    key={event.id}
                    // @ts-expect-error: should accept ReactNode
                    title={event.title}
                    event={event}
                  />
                ))}
              </PopoverContent>
            </Popover>
          ),
        }}
        onShowMore={(events, date) => {
          setDate(date.toISOString())
          setEvents(events)
        }}
      />
    </div>
  )
}

export default Calendar
