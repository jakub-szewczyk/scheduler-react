import type { Meta, StoryObj } from '@storybook/react'
import '../../../../index.css'
import EmptyRow from './EmptyRow'

const meta: Meta<typeof EmptyRow> = {
  title: 'Common/Table/EmptyRow',
  component: EmptyRow,
}

export default meta

type Story = StoryObj<typeof EmptyRow>

export const Primary: Story = {
  args: { columnsLength: 1 },
}
