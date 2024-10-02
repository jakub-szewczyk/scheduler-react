import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/modules/common'
import { ComponentProps, forwardRef } from 'react'
import { match } from 'ts-pattern'

type KanbanColumnProps = ComponentProps<'div'> &
  (
    | {
        status: 'pending'
      }
    | {
        status: 'success'
        title: string
        description?: string | null
      }
    | {
        status: 'error'
      }
  )

const KanbanColumn = forwardRef<HTMLDivElement, KanbanColumnProps>(
  (props, ref) => (
    <Card ref={ref} className={props.className}>
      <CardHeader>
        {match(props)
          .with({ status: 'pending' }, () => (
            <div className='h-7'>
              <Skeleton className='h-5' />
            </div>
          ))
          .with({ status: 'success' }, (props) => (
            <CardTitle className='text-xl'>{props.title}</CardTitle>
          ))
          .with({ status: 'error' }, () => null)
          .exhaustive()}
        {match(props)
          .with({ status: 'pending' }, () => (
            <div className='h-5'>
              <Skeleton className='h-3.5' />
            </div>
          ))
          .with({ status: 'success' }, (props) => (
            <CardDescription
              className={cn(
                'invisible truncate',
                props.description && 'visible'
              )}
            >
              {props.description || 'DESCRIPTION'}
            </CardDescription>
          ))
          .with({ status: 'error' }, () => null)
          .exhaustive()}
      </CardHeader>
      <CardContent
        className={cn('flex max-h-[75vh] flex-col gap-y-2 overflow-y-auto')}
      >
        {match(props)
          .with({ status: 'pending' }, () =>
            Array(10)
              .fill(null)
              .map((_, index) => (
                <Skeleton key={index} className='h-32 flex-shrink-0' />
              ))
          )
          .with({ status: 'success' }, () =>
            Array(10)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className='h-32 flex-shrink-0 rounded-md bg-secondary'
                />
              ))
          )
          .with({ status: 'error' }, () => null)
          .exhaustive()}
      </CardContent>
    </Card>
  )
)

export default KanbanColumn
