import { prop } from 'fp-ts-ramda'
import { pipe } from 'fp-ts/lib/function'
import { includes, map, toLower, trim } from 'ramda'
import { object, string } from 'yup'
import { Issue, Status } from '../../../types/board'

const editStatusValidationSchema = (statuses: Status[]) =>
  object().shape({
    title: string()
      .required('Required')
      .test(
        'unique status titles',
        'This title has already been used by one of your statuses',
        (title = '') =>
          !pipe(
            statuses,
            map(prop('title')),
            includes(pipe(title, trim, toLower))
          )
      ),
  })

const editIssueValidationSchema = (issues: Issue[]) =>
  object().shape({
    title: string()
      .required('Required')
      .test(
        'unique status titles',
        'This title has already been used by one of your issues',
        (title = '') =>
          !pipe(issues, map(prop('title')), includes(pipe(title, trim)))
      ),
    content: string().required('Required'),
  })

export { editStatusValidationSchema, editIssueValidationSchema }
