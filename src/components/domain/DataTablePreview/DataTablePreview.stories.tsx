import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import DataTablePreview from './DataTablePreview'

const meta: Meta<typeof DataTablePreview> = {
  title: 'Domain/DataTablePreview',
  component: DataTablePreview,
}

export default meta

type Story = StoryObj<typeof DataTablePreview>

export const Primary: Story = {
  args: {
    subject: 'project',
    data: Array(5)
      .fill(null)
      .map((_, index) => ({
        id: index.toString(),
        title: `Project #${index + 1}`,
        description: null,
        createdAt: new Date().toISOString(),
      })),
  },
}

export const Empty: Story = {
  args: {
    subject: 'project',
    data: [],
  },
}
