import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import '../../../index.css'
import Sidebar from './Sidebar'

const SidebarWithHooks = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const state = useState(isCollapsed)

  return (
    <div className='-ml-4'>
      <Sidebar isCollapsed={state[0]} setIsCollapsed={state[1]} />
    </div>
  )
}

const meta: Meta<typeof Sidebar> = {
  title: 'Common/Sidebar',
  component: SidebarWithHooks,
}

export default meta

type Story = StoryObj<typeof Sidebar>

export const Collapsed: Story = {
  args: { isCollapsed: true },
}

export const Expanded: Story = {
  args: { isCollapsed: false },
}
