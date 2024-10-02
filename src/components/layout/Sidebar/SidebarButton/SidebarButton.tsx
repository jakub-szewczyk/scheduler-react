import { Button, ButtonProps } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/modules/common'
import { ReactNode } from 'react'

interface SidebarButtonProps extends ButtonProps {
  tooltip?: ReactNode
}

const SidebarButton = ({
  children,
  className,
  tooltip,
  ...props
}: SidebarButtonProps) => {
  const button = (
    <Button
      className={cn(
        'text-muted-foreground transition-colors hover:text-foreground',
        className
      )}
      size='icon'
      variant='ghost'
      {...props}
    >
      {children}
    </Button>
  )

  return tooltip ? (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        {tooltip && <TooltipContent side='right'>{tooltip}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  ) : (
    button
  )
}

export default SidebarButton
