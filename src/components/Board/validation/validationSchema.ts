import { prop } from 'fp-ts-ramda'
import { filter, map } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { includes, toLower } from 'ramda'
import { object, string } from 'yup'
import { deleteStatus } from '../../../modules/board'
import { Issue, Status } from '../../../types/board'

const editStatusValidationSchema = (status: Status, statuses: Status[]) =>
  object().shape({
    title: string()
      .trim()
      .required('Required')
      .test(
        'unique status titles',
        'This title has already been used by one of your statuses',
        (title = '') =>
          !pipe(
            statuses,
            deleteStatus(status.title),
            map(prop('title')),
            includes(toLower(title))
          )
      ),
  })

const editIssueValidationSchema = (issue: Issue, statuses: Status[]) =>
  object().shape({
    title: string()
      .trim()
      .required('Required')
      .test(
        'unique status titles',
        'This title has already been used by one of your issues',
        (title = '') =>
          !pipe(
            statuses.flatMap((status) => status.issues),
            filter(({ title }) => title !== issue.title),
            map(prop('title')),
            includes(title)
          )
      ),
    content: string().trim().required('Required'),
  })

export { editStatusValidationSchema, editIssueValidationSchema }