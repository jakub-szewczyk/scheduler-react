import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/modules/common'
import { ComponentProps, forwardRef } from 'react'
import { match } from 'ts-pattern'

type KanbanIssueProps = ComponentProps<'div'> &
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

const KanbanIssue = forwardRef<HTMLDivElement, KanbanIssueProps>(
  (props, ref) => (
    <Card
      ref={ref}
      className={cn('flex-shrink-0 bg-secondary', props.className)}
    >
      <CardHeader className='p-4'>
        {match(props)
          .with({ status: 'pending' }, { status: 'error' }, () => (
            <div className='h-6'>
              <Skeleton className='h-4 bg-background' />
            </div>
          ))
          .with({ status: 'success' }, (props) => (
            <CardTitle className='truncate text-base font-semibold'>
              {props.title}
            </CardTitle>
          ))
          .exhaustive()}
        {match(props)
          .with({ status: 'pending' }, { status: 'error' }, () => (
            <div className='h-5'>
              <Skeleton className='h-3.5 bg-background' />
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
          .exhaustive()}
      </CardHeader>
    </Card>
  )
)

export default KanbanIssue
