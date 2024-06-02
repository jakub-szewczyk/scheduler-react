import { HTMLAttributes } from 'react'

const Paragraph = ({
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>

export default Paragraph
