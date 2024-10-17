import type { Meta, StoryObj } from '@storybook/react'
import { Event } from 'react-big-calendar'
import '../../../../index.css'
import CalendarEventDeleteConfirmationDialog from './CalendarEventDeleteConfirmationDialog'

const meta: Meta<typeof CalendarEventDeleteConfirmationDialog> = {
  title: 'Domain/CalendarEventDeleteConfirmationDialog',
  component: CalendarEventDeleteConfirmationDialog,
}

export default meta

type Story = StoryObj<typeof CalendarEventDeleteConfirmationDialog>

const EVENT: Event = {
  id: '1',
  title: 'Event #1',
}

export const Primary: Story = {
  args: { open: true, event: EVENT },
}

export const Pending: Story = {
  args: { open: true, isPending: true, event: EVENT },
}
