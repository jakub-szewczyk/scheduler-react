import { cn } from '@/modules/common'
import { HTMLAttributes } from 'react'

const Heading3 = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      'text-2xl scroll-m-20 font-semibold tracking-tight leading-none',
      className
    )}
    {...props}
  >
    {children}
  </h3>
)

export default Heading3
