import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import Heading3 from './Heading3'

const meta: Meta<typeof Heading3> = {
  title: 'Common/Heading3',
  component: Heading3,
}

export default meta

type Story = StoryObj<typeof Heading3>

export const Primary: Story = {
  args: {
    children: 'Scheduler',
  },
}
