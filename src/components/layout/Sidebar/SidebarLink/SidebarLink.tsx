import { Button, ButtonProps } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Link, LinkProps, useLocation } from '@tanstack/react-router'
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
  const location = useLocation()

  const button = (
    <Button className={className} asChild size='icon' variant='ghost'>
      <Link
        disabled={props.to === location.pathname}
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
