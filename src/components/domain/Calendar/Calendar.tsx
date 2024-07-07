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
import CalendarToolbar from './CalendarToolbar/CalendarToolbar'

const localizer = dateFnsLocalizer({
  parse,
  format,
  getDay,
  locales: { 'en-US': enUS },
  startOfWeek,
})

const Calendar = (props: Omit<CalendarProps, 'localizer'>) => (
  <div className='h-[600px]'>
    <BigCalendar
      {...props}
      popup
      localizer={localizer}
      views={{ month: true }}
      components={{ toolbar: CalendarToolbar }}
    />
  </div>
)

export default Calendar
