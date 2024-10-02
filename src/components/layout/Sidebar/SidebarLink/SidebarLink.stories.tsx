import type { Meta, StoryObj } from '@storybook/react'
import { Home } from 'lucide-react'
import '../../../../index.css'
import SidebarLink from './SidebarLink'

const meta: Meta<typeof SidebarLink> = {
  title: 'Layout/Sidebar/SidebarLink',
  component: SidebarLink,
}

export default meta

type Story = StoryObj<typeof SidebarLink>

export const Primary: Story = {
  args: {
    className: 'w-fit p-4',
    children: (
      <div className='flex items-center gap-x-2 w-full animate-[fade-in_300ms]'>
        <Home /> <span>Dashboard</span>
      </div>
    ),
  },
}
