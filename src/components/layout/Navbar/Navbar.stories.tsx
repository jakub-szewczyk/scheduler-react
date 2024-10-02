import ThemeSelect from '@/components/common/ThemeSelect/ThemeSelect'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import Navbar from './Navbar'

const meta: Meta<typeof Navbar> = {
  title: 'Layout/Navbar',
  component: Navbar,
}

export default meta

type Story = StoryObj<typeof Navbar>

export const Primary: Story = {
  args: {
    className: '-mt-4',
    children: (
      <>
        <ThemeSelect dropdownMenuContentProps={{ align: 'end' }} />
        <Avatar className='size-7'>
          <AvatarFallback className='text-xs'>JS</AvatarFallback>
        </Avatar>
      </>
    ),
  },
}
