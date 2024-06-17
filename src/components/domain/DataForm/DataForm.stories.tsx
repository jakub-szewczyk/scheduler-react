import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import DataForm from './DataForm'

const meta: Meta<typeof DataForm> = {
  title: 'Form/DataForm',
  component: DataForm,
}

export default meta

type Story = StoryObj<typeof DataForm>

export const Primary: Story = {
  args: { subject: 'project' },
}
