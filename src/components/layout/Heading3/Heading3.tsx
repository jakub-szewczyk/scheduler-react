import { HTMLAttributes } from 'react'

const Heading3 = ({ children }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className='text-2xl scroll-m-20 font-semibold tracking-tight leading-none'>
    {children}
  </h3>
)

export default Heading3
