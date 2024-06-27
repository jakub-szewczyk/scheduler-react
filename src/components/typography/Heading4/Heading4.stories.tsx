import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import Heading4 from './Heading4'

const meta: Meta<typeof Heading4> = {
  title: 'Typography/Heading4',
  component: Heading4,
}

export default meta

type Story = StoryObj<typeof Heading4>

export const Primary: Story = {
  args: {
    children: 'Scheduler',
  },
}
