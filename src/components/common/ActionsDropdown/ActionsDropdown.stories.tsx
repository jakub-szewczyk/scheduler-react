import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import ActionsDropdown from './ActionsDropdown'

const meta: Meta<typeof ActionsDropdown> = {
  title: 'Common/ActionsDropdown',
  component: ActionsDropdown,
}

export default meta

type Story = StoryObj<typeof ActionsDropdown>

export const Primary: Story = {
  args: { buttonProps: { disabled: false } },
}
