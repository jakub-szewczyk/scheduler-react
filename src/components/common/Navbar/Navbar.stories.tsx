import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import ThemeSelect from '../ThemeSelect/ThemeSelect'
import Navbar from './Navbar'

const meta: Meta<typeof Navbar> = {
  title: 'Common/Navbar',
  component: Navbar,
}

export default meta

type Story = StoryObj<typeof Navbar>

export const Primary: Story = {
  args: {
    className: 'top-[50%] -translate-y-[50%] border-t',
    children: (
      <>
        <ThemeSelect />
        <Avatar className='size-7'>
          <AvatarFallback className='text-xs'>JS</AvatarFallback>
        </Avatar>
      </>
    ),
  },
}
