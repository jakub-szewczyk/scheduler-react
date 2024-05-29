import { cn } from '@/modules/common'
import { Link } from '@tanstack/react-router'
import {
  CalendarCheck,
  Folder,
  Home,
  ListCollapse,
  Settings,
} from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import SidebarButton from '../SidebarButton/SidebarButton'
import SidebarLink from '../SidebarLink/SidebarLink'

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: Dispatch<SetStateAction<boolean>>
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => (
  <aside
    className={cn(
      'z-10 fixed inset-y-0 w-14 border-r bg-background transition-all duration-200',
      !isCollapsed && 'w-52'
    )}
  >
    <div
      className={cn(
        'flex w-full h-12 items-center justify-center gap-x-2',
        !isCollapsed && 'justify-start pl-4'
      )}
    >
      {!isCollapsed ? (
        <Link
          to='/'
          className='flex items-center justify-center gap-x-2 transition-transform duration-100 animate-[fade-in_300ms] hover:scale-[1.025]'
        >
          <div className='w-fit p-1.5 rounded-full bg-foreground text-background animate-[fade-in_300ms]'>
            <CalendarCheck size='20' />
          </div>
          <p className='font-bold text-lg animate-[fade-in_300ms]'>Scheduler</p>
        </Link>
      ) : (
        <Link
          to='/'
          className='w-fit p-1.5 rounded-full bg-foreground text-background transition-transform duration-100 animate-[fade-in_300ms] hover:scale-105'
        >
          <CalendarCheck size='20' />
        </Link>
      )}
    </div>
    <nav
      className={cn(
        'absolute left-0 bottom-0 flex flex-col items-center gap-y-2 w-full h-[calc(100vh-3rem+1px)] py-2 border-t sm:py-4',
        !isCollapsed && 'items-start'
      )}
    >
      <SidebarLink
        className={cn(!isCollapsed && 'w-full pl-4')}
        to='/'
        tooltip={isCollapsed && 'Dashboard'}
      >
        {!isCollapsed ? (
          <div className='flex items-center gap-x-2 w-full animate-[fade-in_300ms]'>
            <Home /> <span>Dashboard</span>
          </div>
        ) : (
          <Home className='animate-[fade-in_300ms]' />
        )}
      </SidebarLink>
      <SidebarLink
        className={cn(!isCollapsed && 'w-full pl-4')}
        to='/projects'
        tooltip={isCollapsed && 'Projects'}
      >
        {!isCollapsed ? (
          <div className='flex items-center gap-x-2 w-full animate-[fade-in_300ms]'>
            <Folder /> <span>Projects</span>
          </div>
        ) : (
          <Folder className='animate-[fade-in_300ms]' />
        )}
      </SidebarLink>
      <SidebarLink
        className={cn('mt-auto', !isCollapsed && 'w-full pl-4')}
        to='/settings'
        tooltip={isCollapsed && 'Settings'}
      >
        {!isCollapsed ? (
          <div className='flex items-center gap-x-2 w-full animate-[fade-in_300ms]'>
            <Settings /> <span>Settings</span>
          </div>
        ) : (
          <Settings className='animate-[fade-in_300ms]' />
        )}
      </SidebarLink>
      <SidebarButton
        className={cn(!isCollapsed && 'w-full pl-4')}
        tooltip={isCollapsed && 'Expand'}
        onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}
      >
        {!isCollapsed ? (
          <div className='flex items-center gap-x-2 w-full animate-[fade-in_300ms]'>
            <ListCollapse className='[transform:rotateY(180deg)]' />
            <span>Collapse</span>
          </div>
        ) : (
          <ListCollapse className='animate-[fade-in_300ms]' />
        )}
      </SidebarButton>
    </nav>
  </aside>
)

export default Sidebar
