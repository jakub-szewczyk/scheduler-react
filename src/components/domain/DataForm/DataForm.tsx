import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Subject } from '@/types/common'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = (subject: Subject) =>
  z.object({
    title: z.string().min(1, `Please enter ${subject}'s title`),
    description: z.string(),
  })

type Inputs = z.infer<ReturnType<typeof formSchema>>

interface DataFormProps {
  subject: Subject
  onSubmit: (inputs: Inputs) => void
}

const DataForm = ({ subject, onSubmit }: DataFormProps) => {
  const form = useForm<Inputs>({
    defaultValues: {
      title: '',
      description: '',
    },
    resolver: zodResolver(formSchema(subject)),
  })

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-y-12'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-y-4'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='sm:max-w-sm'>
                <FormLabel>
                  Title<span className='text-destructive'>*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Enter title' {...field} />
                </FormControl>
                <FormDescription>
                  This value has to be unique. There can only be one {subject}{' '}
                  associated with this title.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='sm:max-w-3xl'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className='resize-none'
                    placeholder='Enter description'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='flex gap-x-2 sm:w-fit' type='submit'>
          Submit
          <Send className='size-4' />
        </Button>
      </form>
    </Form>
  )
}

export default DataForm
