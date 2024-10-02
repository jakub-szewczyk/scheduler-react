import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import ThemeSelect from './ThemeSelect'

const meta: Meta<typeof ThemeSelect> = {
  title: 'Common/ThemeSelect',
  component: ThemeSelect,
}

export default meta

type Story = StoryObj<typeof ThemeSelect>

export const Primary: Story = {
  args: { dropdownMenuContentProps: { align: 'start' } },
}
