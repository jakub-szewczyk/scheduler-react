import { Folder, Home, Settings } from 'lucide-react'
import SidebarLink from '../SidebarLink/SidebarLink'

const Sidebar = () => (
  <aside className='w-14 border-r h-[calc(100vh-3rem)]'>
    <nav className='flex flex-col items-center gap-y-2 h-full py-2'>
      <SidebarLink to='/'>
        <Home />
      </SidebarLink>
      <SidebarLink to='/projects'>
        <Folder />
      </SidebarLink>
      <SidebarLink className='mt-auto' to='/settings'>
        <Settings />
      </SidebarLink>
    </nav>
  </aside>
)

export default Sidebar
