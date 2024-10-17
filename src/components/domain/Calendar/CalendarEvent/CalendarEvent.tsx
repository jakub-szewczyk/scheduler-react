import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/modules/common'
import { MUTED_COLOR_CLASSES } from '@/modules/event'
import { GetEventsResponseBody, deleteEvent } from '@/services/event'
import {
  createNotification,
  getNotification,
  updateNotification,
} from '@/services/notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams, useSearch } from '@tanstack/react-router'
import { format, isSameDay } from 'date-fns'
import {
  Bell,
  Calendar,
  CalendarClock,
  Clock,
  Pencil,
  Trash,
} from 'lucide-react'
import { EventProps } from 'react-big-calendar'
import { useBoolean } from 'usehooks-ts'
import NotificationDetails from '../../Notification/NotificationDetails/NotificationDetails'
import NotificationDialog from '../../Notification/NotificationDialog/NotificationDialog'
import CalendarEventDeleteConfirmationDialog from '../CalendarEventDeleteConfirmationDialog/CalendarEventDeleteConfirmationDialog'

const CalendarEvent = ({ title, event }: EventProps) => {
  const {
    value: isDeleteDialogOpen,
    setValue: setIsDeleteDialogOpen,
    setTrue: openDeleteDialog,
    setFalse: closeDeleteDialog,
  } = useBoolean()

  const {
    value: isNotificationDialogOpen,
    setValue: setIsNotificationDialogOpen,
    setTrue: openNotificationDialog,
    setFalse: closeNotificationDialog,
  } = useBoolean()

  const params = useParams({
    from: '/projects/$projectId/schedules/$scheduleId/events/',
  })

  const search = useSearch({
    from: '/projects/$projectId/schedules/$scheduleId/events/',
  })

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const getEventsQueryData = queryClient.getQueryData<GetEventsResponseBody>([
    'projects',
    params.projectId,
    'schedules',
    params.scheduleId,
    'events',
    search,
  ])!

  const { color } = getEventsQueryData.content.find(
    ({ id }) => id === event.id
  )!

  /**
   * FIXME:
   * Error after deleting an event from the "+x more" popover.
   * It has something to do with the above color destructuring.
   */
  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'projects',
          params.projectId,
          'schedules',
          params.scheduleId,
          'events',
        ],
      })
      closeDeleteDialog()
    },
  })

  const getNotificationQuery = useQuery({
    queryKey: [
      'projects',
      params.projectId,
      'schedules',
      params.scheduleId,
      'events',
      event.id,
      'notification',
    ],
    queryFn: () =>
      getNotification({
        projectId: params.projectId,
        scheduleId: params.scheduleId,
        eventId: event.id,
      }),
    enabled: isNotificationDialogOpen,
  })

  const createNotificationMutation = useMutation({
    mutationFn: createNotification,
    onSuccess: (notification) => {
      queryClient.invalidateQueries({
        queryKey: [
          'projects',
          params.projectId,
          'schedules',
          params.scheduleId,
          'events',
          event.id,
          'notification',
        ],
      })
      closeNotificationDialog()
      toast({
        title: 'Notification created',
        description: `${notification.title} has been successfully created`,
      })
    },
    onError: (error) =>
      toast({
        variant: 'destructive',
        title: 'Form submission failed',
        description: error.response?.data?.[0]?.msg,
      }),
  })

  const updateNotificationMutation = useMutation({
    mutationFn: updateNotification,
    onSuccess: (notification) => {
      queryClient.invalidateQueries({
        queryKey: [
          'projects',
          params.projectId,
          'schedules',
          params.scheduleId,
          'events',
          event.id,
          'notification',
        ],
      })
      closeNotificationDialog()
      toast({
        title: 'Notification updated',
        description: `${notification.title} has been successfully updated`,
      })
    },
    onError: (error) =>
      toast({
        variant: 'destructive',
        title: 'Form submission failed',
        description: error.response?.data?.[0]?.msg,
      }),
  })

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'h-7 w-full justify-start',
              MUTED_COLOR_CLASSES[color]
            )}
            size='sm'
          >
            <span className='truncate'>{title}</span>
          </Button>
        </PopoverTrigger>
        {event.start && event.end && (
          <PopoverContent className='w-80' side='right'>
            <dl className='flex flex-col gap-y-2 text-sm'>
              <div className='flex items-center justify-between gap-x-2'>
                <dt className='truncate font-bold'>{event.title}</dt>
                <dd className='flex gap-x-1'>
                  <Button
                    data-testid='edit-event'
                    className='size-8'
                    size='icon'
                    variant='outline'
                    asChild
                  >
                    <Link
                      to='/projects/$projectId/schedules/$scheduleId/events/$eventId/edit'
                      params={{
                        projectId: params.projectId,
                        scheduleId: params.scheduleId,
                        eventId: event.id,
                      }}
                    >
                      <Pencil className='size-4' />
                    </Link>
                  </Button>
                  <Button
                    data-testid='delete-event'
                    className='size-8'
                    size='icon'
                    variant='destructive'
                    onClick={openDeleteDialog}
                  >
                    <Trash className='size-4' />
                  </Button>
                </dd>
              </div>
              {isSameDay(event.start, event.end) ? (
                <div className='flex gap-x-2'>
                  <div className='flex items-center gap-x-2'>
                    <dt>
                      <Calendar className='size-4' />
                    </dt>
                    <dd>{format(event.start, 'E d MMM')}</dd>
                  </div>
                  <div className='flex items-center gap-x-2'>
                    <dt>
                      <Clock className='size-4' />
                    </dt>
                    <dd>
                      {format(event.start, 'HH:mm')} -{' '}
                      {format(event.end, 'HH:mm')}
                    </dd>
                  </div>
                </div>
              ) : (
                <>
                  <div className='flex items-center gap-x-2'>
                    <dt>
                      <CalendarClock className='size-4' />
                    </dt>
                    <dd>
                      {format(event.start, 'E d MMM HH:mm')} -{' '}
                      {format(event.end, 'E d MMM HH:mm')}
                    </dd>
                  </div>
                </>
              )}
              <NotificationDetails event={event} />
            </dl>
            <Button
              className='mt-4 w-full gap-x-2'
              size='sm'
              variant='outline'
              onClick={openNotificationDialog}
            >
              Notification Settings <Bell className='size-4' />
            </Button>
          </PopoverContent>
        )}
      </Popover>
      <CalendarEventDeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isPending={deleteEventMutation.isPending}
        event={event}
        onConfirm={(event) =>
          deleteEventMutation.mutate({
            projectId: params.projectId,
            scheduleId: params.scheduleId,
            eventId: event.id,
          })
        }
      />
      <NotificationDialog
        open={isNotificationDialogOpen}
        onOpenChange={setIsNotificationDialogOpen}
        isLoading={getNotificationQuery.isLoading}
        isFetching={getNotificationQuery.isFetching}
        isPlaceholderData={getNotificationQuery.isPlaceholderData}
        isPending={
          createNotificationMutation.isPending ||
          updateNotificationMutation.isPending
        }
        event={event}
        notification={getNotificationQuery.data}
        onSubmit={(inputs) =>
          getNotificationQuery.data
            ? updateNotificationMutation.mutate({
                ...inputs,
                projectId: params.projectId,
                scheduleId: params.scheduleId,
                eventId: event.id,
                startsAt: inputs.startsAt.toISOString(),
              })
            : createNotificationMutation.mutate({
                ...inputs,
                projectId: params.projectId,
                scheduleId: params.scheduleId,
                eventId: event.id,
                startsAt: inputs.startsAt.toISOString(),
              })
        }
      />
    </>
  )
}

export default CalendarEvent
