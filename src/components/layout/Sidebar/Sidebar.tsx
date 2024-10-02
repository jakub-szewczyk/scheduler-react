import { cn } from '@/modules/common'
import { Link } from '@tanstack/react-router'
import {
  CalendarCheck,
  Folder,
  Home,
  ListCollapse,
  LucideProps,
  Settings,
} from 'lucide-react'
import {
  Dispatch,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  SetStateAction,
  createElement,
} from 'react'
import SidebarButton from './SidebarButton/SidebarButton'
import SidebarLink from './SidebarLink/SidebarLink'

const SIDEBAR_LINKS: {
  to: SidebarLink['to']
  title: ReactNode
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
}[] = [
  { to: '/', title: 'Dashboard', icon: Home },
  { to: '/projects', title: 'Projects', icon: Folder },
  { to: '/settings', title: 'Settings', icon: Settings },
]

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: Dispatch<SetStateAction<boolean>>
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => (
  <aside
    className={cn(
      'fixed inset-y-0 z-10 w-14 border-r bg-background transition-[width] duration-300',
      !isCollapsed && 'w-52'
    )}
  >
    <div className={cn('flex h-12 w-full items-center justify-center gap-x-2')}>
      <Link
        to='/'
        className='flex w-full items-center gap-x-2 pl-3 transition-transform duration-100 hover:scale-[1.025]'
      >
        <div className='w-fit rounded-full bg-foreground p-1.5 text-background'>
          <CalendarCheck size='20' />
        </div>
        <p
          className={cn('truncate text-lg font-bold', isCollapsed && 'hidden')}
        >
          Scheduler
        </p>
      </Link>
    </div>
    <nav
      className={cn(
        'absolute bottom-0 left-0 flex h-[calc(100vh-3rem+1px)] w-full flex-col items-center gap-y-2 border-t py-2 sm:py-4',
        !isCollapsed && 'items-start'
      )}
    >
      {SIDEBAR_LINKS.map(({ to, title, icon }) => (
        <SidebarLink
          key={to}
          className={cn(
            'mx-auto flex w-[calc(100%-1rem)] justify-start gap-x-2 px-2',
            to === '/settings' && 'mt-auto'
          )}
          to={to}
          tooltip={isCollapsed && title}
        >
          {createElement(icon, { className: 'flex-shrink-0' })}
          <span className={cn('truncate', isCollapsed && 'hidden')}>
            {title}
          </span>
        </SidebarLink>
      ))}
      <SidebarButton
        className='mx-auto flex w-[calc(100%-1rem)] justify-start gap-x-2 px-2'
        tooltip={isCollapsed && 'Expand'}
        onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}
      >
        <ListCollapse
          className={cn(
            'flex-shrink-0',
            !isCollapsed && '[transform:rotateY(180deg)]'
          )}
        />
        <span className={cn('truncate', isCollapsed && 'hidden')}>
          {isCollapsed ? 'Expand' : 'Collapse'}
        </span>
      </SidebarButton>
    </nav>
  </aside>
)

export default Sidebar
