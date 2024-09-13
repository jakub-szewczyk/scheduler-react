import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/modules/common'
import { getNotification, toggleNotification } from '@/services/notification'
import { Notification } from '@/types/notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { formatDistanceStrict } from 'date-fns'
import { Bell } from 'lucide-react'
import { Event } from 'react-big-calendar'

interface NotificationDetailsProps {
  event: Event
}

const NotificationDetails = ({ event }: NotificationDetailsProps) => {
  const params = useParams({
    from: '/projects/$projectId/schedules/$scheduleId/events/',
  })

  const queryKey = [
    'projects',
    params.projectId,
    'schedules',
    params.scheduleId,
    'events',
    event.id,
    'notification',
  ]

  const getNotificationQuery = useQuery({
    queryKey,
    queryFn: () =>
      getNotification({
        projectId: params.projectId,
        scheduleId: params.scheduleId,
        eventId: event.id,
      }),
  })

  const queryClient = useQueryClient()

  const toggleNotificationMutation = useMutation({
    mutationFn: toggleNotification,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey,
      })
      const notification = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (notification: Notification) => ({
        ...notification,
        isActive: !notification.isActive,
      }))
      return { notification }
    },
    onError: (_, __, context) =>
      queryClient.setQueryData(queryKey, context!.notification),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return (
    <div
      className={cn(
        'flex items-center gap-x-2',
        (getNotificationQuery.isFetching ||
          getNotificationQuery.data === null ||
          toggleNotificationMutation.isPending) &&
          'text-muted-foreground'
      )}
    >
      <dt>
        <Bell className='size-4' />
      </dt>
      {getNotificationQuery.isLoading ? (
        <Skeleton className='h-5 w-full' />
      ) : getNotificationQuery.isSuccess ? (
        getNotificationQuery.data ? (
          <dd className='flex items-center gap-x-2'>
            {formatDistanceStrict(
              event.start!,
              getNotificationQuery.data.startsAt
            )}{' '}
            before
            <Switch
              checked={getNotificationQuery.data.isActive}
              onCheckedChange={(isActive) =>
                toggleNotificationMutation.mutate({
                  projectId: params.projectId,
                  scheduleId: params.scheduleId,
                  eventId: event.id,
                  isActive,
                })
              }
            />
          </dd>
        ) : (
          <dd>No Notification</dd>
        )
      ) : (
        <dd className='text-destructive'>
          Couldn't fetch notification data. Please try again later.
        </dd>
      )}
    </div>
  )
}

export default NotificationDetails
