import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import {
  Calendar as BigCalendar,
  CalendarProps,
  dateFnsLocalizer,
} from 'react-big-calendar'
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

const Calendar = (props: Omit<CalendarProps, 'localizer'>) => (
  <div className='h-[600px] [&_.rbc-show-more]:!text-teal-600'>
    <BigCalendar
      {...props}
      localizer={localizer}
      views={{ month: true }}
      components={{ event: CalendarEvent, toolbar: CalendarToolbar }}
    />
  </div>
)

export default Calendar
