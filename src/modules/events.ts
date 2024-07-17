import {
  addMonths,
  differenceInMonths,
  endOfMonth,
  isFirstDayOfMonth,
  startOfMonth,
} from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const monthsGap = (
  start: string | number | Date,
  end: string | number | Date
) => differenceInMonths(endOfMonth(end), startOfMonth(start))

export const calendarDefaultDate = (
  start: string | number | Date,
  end: string | number | Date
) => {
  const gap = monthsGap(start, end)
  if (gap === 0) return new Date(start)
  if (gap === 1)
    return isFirstDayOfMonth(start) ? new Date(start) : new Date(end)
  if (gap === 2) return addMonths(start, 1)
  return new Date()
}
