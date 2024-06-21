import { cn } from '@/modules/common'
import { HTMLAttributes } from 'react'

const Heading4 = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h4
    className={cn(
      'text-1xl scroll-m-20 font-semibold tracking-tight leading-none',
      className
    )}
    {...props}
  >
    {children}
  </h4>
)

export default Heading4
