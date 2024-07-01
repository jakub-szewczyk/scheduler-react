import { useEffect } from 'react'
import { ToolbarProps } from 'react-big-calendar'
// @ts-expect-error missing type declarations
import Toolbar from 'react-big-calendar/lib/Toolbar'

const CalendarToolbar = (props: ToolbarProps) => {
  useEffect(() => {
    props.onView(props.view)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Toolbar {...props} />
}

export default CalendarToolbar
