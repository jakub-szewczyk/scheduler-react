import { flow } from 'fp-ts/lib/function'
import { isSome } from 'fp-ts/lib/Option'
import { object, string } from 'yup'
import * as TIME from '../../../modules/time'

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
        flow(TIME.format, isSome)
      ),
    otherwise: string().nullable().notRequired(),
  }),
})

export default validationSchema
