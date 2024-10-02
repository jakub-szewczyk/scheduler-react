import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Notification } from '@/types/notification'
import { DialogProps } from '@radix-ui/react-dialog'
import { LoaderCircle, Send } from 'lucide-react'
import { ComponentProps, useRef } from 'react'
import { Event as BigCalendarEvent } from 'react-big-calendar'
import NotificationForm from '../NotificationForm/NotificationForm'

interface NotificationDialogProps extends DialogProps {
  isLoading?: boolean
  isFetching?: boolean
  isPlaceholderData?: boolean
  isPending?: boolean
  event: BigCalendarEvent
  notification?: Notification | null
  onSubmit: ComponentProps<typeof NotificationForm>['onSubmit']
}

const NotificationDialog = ({
  isLoading,
  isFetching,
  isPlaceholderData,
  isPending,
  event,
  notification,
  onSubmit,
  ...props
}: NotificationDialogProps) => {
  const ref = useRef<HTMLFormElement>(null)

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader className='overflow-x-hidden'>
          <DialogTitle>Notification settings</DialogTitle>
          <DialogDescription>
            Manage your notification preferences for this event. Customize when
            and how you're alerted.
          </DialogDescription>
        </DialogHeader>
        <NotificationForm
          ref={ref}
          isLoading={isLoading}
          isFetching={isFetching}
          isPlaceholderData={isPlaceholderData}
          event={event}
          values={
            notification
              ? {
                  title: notification.title,
                  description: notification.description || '',
                  startsAt: new Date(notification.startsAt),
                  isActive: notification.isActive,
                }
              : undefined
          }
          onSubmit={onSubmit}
        >
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className='mt-2 sm:mt-0 sm:w-fit'
                type='button'
                variant='ghost'
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className='flex gap-x-2 sm:w-fit'
              type='button'
              disabled={
                isLoading || (isFetching && !isPlaceholderData) || isPending
              }
              onClick={() =>
                ref.current &&
                ref.current.dispatchEvent(
                  new Event('submit', { bubbles: true })
                )
              }
            >
              Submit
              {isPending ? (
                <LoaderCircle className='size-4 animate-spin' />
              ) : (
                <Send className='size-4' />
              )}
            </Button>
          </DialogFooter>
        </NotificationForm>
      </DialogContent>
    </Dialog>
  )
}

export default NotificationDialog
