import type { Meta, StoryObj } from '@storybook/react'
import { Home } from 'lucide-react'
import '../../../../index.css'
import SidebarButton from './SidebarButton'

const meta: Meta<typeof SidebarButton> = {
  title: 'Layout/Sidebar/SidebarButton',
  component: SidebarButton,
}

export default meta

type Story = StoryObj<typeof SidebarButton>

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
