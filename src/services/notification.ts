import { Event } from '@/types/event'
import { Notification } from '@/types/notification'
import { Project } from '@/types/project'
import { Schedule } from '@/types/schedule'
import { api } from './api'

// GET /projects/:projectId/schedules/:scheduleId/events/:eventId/notification
type GetNotificationPathParams = {
  projectId: Project['id']
  scheduleId: Schedule['id']
  eventId: Event['id']
}

export const getNotification = ({
  projectId,
  scheduleId,
  eventId,
}: GetNotificationPathParams) =>
  api<Notification | null>(
    `/projects/${projectId}/schedules/${scheduleId}/events/${eventId}/notification`
  ).then(({ data }) => data)

// PATCH /projects/:projectId/schedules/:scheduleId/events/:eventId/notification/is-active
type ToggleNotificationPathParams = {
  projectId: Project['id']
  scheduleId: Schedule['id']
  eventId: Event['id']
}

type ToggleNotificationRequestBody = Pick<Notification, 'isActive'>

export const toggleNotification = ({
  projectId,
  scheduleId,
  eventId,
  ...data
}: ToggleNotificationPathParams & ToggleNotificationRequestBody) =>
  api
    .patch<Notification | null>(
      `/projects/${projectId}/schedules/${scheduleId}/events/${eventId}/notification/is-active`,
      data
    )
    .then(({ data }) => data)
