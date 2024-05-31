import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import EmptyTableRow from './EmptyTableRow'

const meta: Meta<typeof EmptyTableRow> = {
  title: 'Common/EmptyTableRow',
  component: EmptyTableRow,
}

export default meta

type Story = StoryObj<typeof EmptyTableRow>

export const Primary: Story = {
  args: { columnsLength: 1 },
}
