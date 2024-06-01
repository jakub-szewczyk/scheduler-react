import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import Paragraph from './Paragraph'

const meta: Meta<typeof Paragraph> = {
  title: 'Common/Paragraph',
  component: Paragraph,
}

export default meta

type Story = StoryObj<typeof Paragraph>

export const Primary: Story = {
  args: {
    children: 'Scheduler',
  },
}
