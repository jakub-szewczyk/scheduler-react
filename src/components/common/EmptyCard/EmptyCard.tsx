import { Card, CardHeader } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { ComponentProps } from 'react'

const EmptyCard = (props: ComponentProps<typeof Card>) => (
  <Card
    className='mx-2 w-[350px] cursor-pointer border-dashed transition-colors hover:bg-muted'
    role='button'
    {...props}
  >
    <CardHeader className='flex flex-col items-center justify-center gap-y-2 py-[18px]'>
      <div className='flex size-[60px] items-center justify-center gap-x-2 rounded-full border border-dashed border-muted-foreground bg-transparent'>
        <Plus className='size-6 text-muted-foreground' />
      </div>
      <span className='text-sm text-muted-foreground'>
        Create your first entry
      </span>
    </CardHeader>
  </Card>
)

export default EmptyCard
