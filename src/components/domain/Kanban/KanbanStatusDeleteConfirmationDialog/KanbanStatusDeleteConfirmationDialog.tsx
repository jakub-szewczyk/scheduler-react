import Paragraph from '@/components/typography/Paragraph/Paragraph'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/modules/common'
import { Status } from '@/types/status'
import { AlertDialogProps } from '@radix-ui/react-alert-dialog'
import { LoaderCircle, Trash } from 'lucide-react'

interface KanbanStatusDeleteConfirmationDialogProps extends AlertDialogProps {
  isPending?: boolean
  status: Pick<Status, 'title'>
  onConfirm: (status: Pick<Status, 'title'>) => void
}

const KanbanStatusDeleteConfirmationDialog = ({
  isPending,
  status,
  onConfirm,
  ...props
}: KanbanStatusDeleteConfirmationDialogProps) => (
  <AlertDialog {...props}>
    <AlertDialogContent>
      <AlertDialogHeader className='overflow-x-hidden'>
        <AlertDialogTitle>Warning: Permanent Deletion</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div>
            This action cannot be undone. It will delete your status and all
            data associated with it.
            <Paragraph className='mt-4'>
              The following status will cease to exist:
            </Paragraph>
            <div className='mt-4 whitespace-nowrap rounded-md border border-destructive p-2.5 text-destructive'>
              {status.title}
            </div>
            <Paragraph className='mt-4'>
              Are you sure you want to proceed?
            </Paragraph>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button
            className={cn(
              buttonVariants({ variant: 'destructive' }),
              'gap-x-2'
            )}
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault()
              onConfirm(status)
            }}
          >
            Yes, delete
            {isPending ? (
              <LoaderCircle className='size-4 animate-spin' />
            ) : (
              <Trash className='size-4' />
            )}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

export default KanbanStatusDeleteConfirmationDialog
