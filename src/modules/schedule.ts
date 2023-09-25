import { pipe } from 'fp-ts/lib/function'
import { map } from 'ramda'
import { utils, writeFileXLSX } from 'xlsx'
import * as ROW from '../modules/row'
import { Schedule } from '../types/schedule'

export const initialValues = (mode: 'CREATE' | 'EDIT', schedule: Schedule) => ({
  name: mode === 'EDIT' ? schedule.name || '' : '',
})

export const exportToXLSX = (schedule: Schedule) => () => {
  const ws = utils.json_to_sheet(pipe(schedule.rows, map(ROW.toXLSX)))
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')
  writeFileXLSX(wb, `${schedule.name}.xlsx`)
}
