import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/modules/common'
import { MUTED_COLOR_CLASSES } from '@/modules/event'
import { GetEventsResponseBody, deleteEvent } from '@/services/event'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import NotificationDescriptionDetails from '../../Notification/NotificationDescriptionDetails/NotificationDescriptionDetails'
import CalendarEventDeleteConfirmationDialog from '../CalendarEventDeleteDialog/CalendarEventDeleteConfirmationDialog'

const CalendarEvent = ({ title, event }: EventProps) => {
  const {
    value: isDialogOpen,
    setValue: setIsDialogOpen,
    setTrue: openDialog,
    setFalse: closeDialog,
  } = useBoolean()

  const params = useParams({
    from: '/projects/$projectId/schedules/$scheduleId/events/',
  })

  const search = useSearch({
    from: '/projects/$projectId/schedules/$scheduleId/events/',
  })

  const queryClient = useQueryClient()

  const getEventsQuery = queryClient.getQueryData<GetEventsResponseBody>([
    'projects',
    params.projectId,
    'schedules',
    params.scheduleId,
    'events',
    search,
  ])!

  const { color } = getEventsQuery.content.find(({ id }) => id === event.id)!

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
      closeDialog()
    },
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
                    className='size-8'
                    size='icon'
                    variant='destructive'
                    onClick={openDialog}
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
              <NotificationDescriptionDetails event={event} />
            </dl>
            <Button className='mt-4 w-full gap-x-2' size='sm' variant='outline'>
              Notification Settings <Bell className='size-4' />
            </Button>
          </PopoverContent>
        )}
      </Popover>
      <CalendarEventDeleteConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
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
    </>
  )
}

export default CalendarEvent
