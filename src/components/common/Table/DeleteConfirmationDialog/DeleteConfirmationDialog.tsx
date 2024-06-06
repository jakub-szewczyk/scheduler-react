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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/modules/common'
import { Subject } from '@/types/common'
import { AlertDialogProps } from '@radix-ui/react-alert-dialog'
import { Row } from '@tanstack/react-table'
import { LoaderCircle, Trash } from 'lucide-react'

interface DeleteConfirmationDialogProps<Data> extends AlertDialogProps {
  isPending?: boolean
  subject: Subject
  rows: Row<Data>[]
  onConfirm: (rows: Row<Data>[]) => void
}

const DeleteConfirmationDialog = <Data,>({
  isPending,
  subject,
  rows,
  onConfirm,
  ...props
}: DeleteConfirmationDialogProps<Data>) => (
  <AlertDialog {...props}>
    <AlertDialogContent>
      <AlertDialogHeader className='overflow-x-hidden'>
        <AlertDialogTitle>Warning: Permanent Deletion</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div>
            This action cannot be undone. It will delete your {subject}s and all
            data associated with them.
            <Paragraph className='mt-4'>
              The following {subject}s will cease to exist:
            </Paragraph>
            <ScrollArea className='mt-4 p-2.5 text-destructive border border-destructive rounded-md whitespace-nowrap'>
              {rows.map((row) => row.getValue('title')).join(', ')}
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
            <Paragraph className='mt-4'>
              Are you sure you want to proceed?
            </Paragraph>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button
            className={cn(
              buttonVariants({ variant: 'destructive' }),
              'gap-x-2'
            )}
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault()
              onConfirm(rows)
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

export default DeleteConfirmationDialog
