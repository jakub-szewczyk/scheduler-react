import type { Meta, StoryObj } from '@storybook/react'
import '../../../index.css'
import DataForm from './DataForm'

const title = 'Community Engagement Platform'

const description =
  'Develop a digital platform designed to enhance community engagement and interaction. The platform will facilitate communication, event organization, and resource sharing among community members.'

const meta: Meta<typeof DataForm> = {
  title: 'Form/DataForm',
  component: DataForm,
}

export default meta

type Story = StoryObj<typeof DataForm>

export const Create: Story = {
  args: { subject: 'project' },
}

export const Update: Story = {
  args: {
    subject: 'project',
    values: {
      title,
      description,
    },
  },
}

export const Loading: Story = {
  args: { subject: 'project', isLoading: true },
}

export const Fetching: Story = {
  args: {
    subject: 'project',
    isFetching: true,
    values: {
      title,
      description,
    },
  },
}

export const Pending: Story = {
  args: {
    subject: 'project',
    isPending: true,
    values: {
      title,
      description,
    },
  },
}
