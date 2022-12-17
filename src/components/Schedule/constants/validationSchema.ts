import { flow } from 'fp-ts/lib/function'
import { isSome } from 'fp-ts/lib/Option'
import { object, string } from 'yup'
import toTimeFormat from '../functions/toTimeFormat'

const validationSchema = object({
  notification: string().oneOf(
    ['0', '5', '10', '15', 'custom'],
    'Invalid option'
  ),
  time: string().when('notification', {
    is: 'custom',
    then: string()
      .nullable()
      .required('Required')
      .test(
        'matches-time-format',
        'Invalid date format',
        flow(toTimeFormat, isSome)
      ),
    otherwise: string().notRequired(),
  }),
})

export default validationSchema
