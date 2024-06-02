import type { Meta, StoryObj } from '@storybook/react'
import '../../../../index.css'
import NoResultsRow from './NoResultsRow'

const meta: Meta<typeof NoResultsRow> = {
  title: 'Common/Table/NoResultsRow',
  component: NoResultsRow,
}

export default meta

type Story = StoryObj<typeof NoResultsRow>

export const Primary: Story = {
  args: { columnsLength: 1 },
}
