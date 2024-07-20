import { Event } from '@/types/event'
import {
  addMonths,
  differenceInMonths,
  endOfMonth,
  isFirstDayOfMonth,
  startOfMonth,
} from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'

export const COLORS = ['BLUE', 'ORANGE', 'PURPLE', 'TEAL'] as const

export const COLOR_VARIANTS: { [key in Event['color']]: string } = {
  BLUE: 'bg-blue-200 text-blue-600 hover:bg-blue-200/90',
  ORANGE: 'bg-orange-200 text-orange-600 hover:bg-orange-200/90',
  PURPLE: 'bg-purple-200 text-purple-600 hover:bg-purple-200/90',
  TEAL: 'bg-teal-200 text-teal-600 hover:bg-teal-200/90',
}

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
