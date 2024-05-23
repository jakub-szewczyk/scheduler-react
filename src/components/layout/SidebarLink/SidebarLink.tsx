import { Button, ButtonProps } from '@/components/ui/button'
import { Link, LinkProps } from '@tanstack/react-router'

interface SidebarLink extends LinkProps {
  className?: ButtonProps['className']
}

const SidebarLink = ({ children, className, ...props }: SidebarLink) => (
  <Button className={className} asChild variant='ghost' size='icon'>
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

export default SidebarLink
