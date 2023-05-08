import { Project } from '@/types/project'
import { prop } from 'fp-ts-ramda'
import { filter, map } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { includes } from 'ramda'
import { object, string } from 'yup'

const validationSchema = (project: Project, projects: Project[]) =>
  object().shape({
    name: string()
      .trim()
      .required('Required')
      .notOneOf(
        ['unsaved', 'unsaved*'],
        'This name has been set aside for exclusive purposes'
      )
      .test(
        'unique project names',
        'This name has already been used by one of your projects',
        (name = '') =>
          !pipe(
            projects,
            filter(({ name }) => name !== project.name),
            map(prop('name')),
            includes(name)
          )
      ),
  })

export default validationSchema
