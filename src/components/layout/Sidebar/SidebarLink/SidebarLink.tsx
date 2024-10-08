import { Button, ButtonProps } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Link, LinkProps } from '@tanstack/react-router'
import { ReactNode } from 'react'

interface SidebarLink extends LinkProps {
  className?: ButtonProps['className']
  tooltip?: ReactNode
}

const SidebarLink = ({
  children,
  className,
  tooltip,
  ...props
}: SidebarLink) => {
  const button = (
    <Button className={className} size='icon' variant='ghost' asChild>
      <Link
        inactiveProps={{
          className:
            'text-muted-foreground transition-colors hover:text-foreground',
        }}
        {...props}
      >
        {children}
      </Link>
    </Button>
  )

  return tooltip ? (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side='right'>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    button
  )
}

export default SidebarLink
