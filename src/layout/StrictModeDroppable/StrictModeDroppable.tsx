import { useEffect, useState } from 'react'
import { Droppable, DroppableProps } from 'react-beautiful-dnd'

/**
 * NOTE:
 * https://tinyurl.com/w9f5b7at
 */
const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      setEnabled(false)
      cancelAnimationFrame(animation)
    }
  }, [])

  return enabled ? <Droppable {...props}>{children}</Droppable> : null
}

export default StrictModeDroppable
