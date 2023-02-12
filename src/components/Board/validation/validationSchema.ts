import { prop } from 'fp-ts-ramda'
import { pipe } from 'fp-ts/lib/function'
import { includes, map, toLower, trim } from 'ramda'
import { object, string } from 'yup'
import { Status } from '../../../types/board'

const editStatusValidationSchema = (statuses: Status[]) =>
  object().shape({
    title: string()
      .required('Required')
      .matches(/^\S*$/, 'No whitespace allowed')
      .test(
        'unique status names',
        'This title has already been used by one of your statuses',
        (title = '') =>
          !pipe(
            statuses,
            map(prop('title')),
            includes(pipe(title, trim, toLower))
          )
      ),
  })

export { editStatusValidationSchema }
