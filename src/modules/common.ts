import { prop } from 'fp-ts-ramda'
import { flow } from 'fp-ts/lib/function'
import { __, concat, equals, when } from 'ramda'
import { Board } from '../types/board'
import { Schedule } from '../types/schedule'

const isUnsaved: (widget: Schedule | Board) => boolean = flow(
  prop('name'),
  equals('unsaved')
)

const asteriskSuffix = when(equals('unsaved'), concat(__, '*'))

export { isUnsaved, asteriskSuffix }