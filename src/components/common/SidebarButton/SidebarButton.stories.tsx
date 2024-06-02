import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import SidebarButton from './SidebarButton'
import { Home } from 'lucide-react'

const meta: Meta<typeof SidebarButton> = {
  title: 'Common/SidebarButton',
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
