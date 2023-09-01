import DataChangeBar from '@/layout/DataChangeBar/DataChangeBar'
import { Row } from '@/types/row'
import { Schedule as ISchedule } from '@/types/schedule'
import { equals } from 'ramda'
import { Updater } from 'use-immer'
import * as TABLE from '../../modules/table'
import ScheduleHeader from './ScheduleHeader'
import createColumns from './helpers/createColumns'
import { DataGrid, DataGridContainer } from './styles/DataGrid.styled'

interface ScheduleProps {
  schedule: ISchedule
  rows: Row[]
  setRows: Updater<Row[]>
}

const Schedule = ({ schedule, rows, setRows }: ScheduleProps) => {
  const columns = createColumns(setRows)

  return (
    <>
      <ScheduleHeader schedule={schedule} />
      <DataGridContainer
        elevation={0}
        height={TABLE.calculateHeight(rows)}
        sx={{
          maxWidth: (theme) =>
            Math.min(
              theme.breakpoints.values.lg,
              TABLE.calculateMaxWidth(columns)
            ),
        }}
      >
        <DataGrid
          disableColumnMenu
          hideFooterPagination
          headerHeight={TABLE.HEADER_HEIGHT}
          rowHeight={TABLE.ROW_HEIGHT}
          columns={columns}
          rows={rows}
          onCellEditCommit={({ field, value, id }) =>
            setRows((rows) => {
              const row = rows.find((row) => row.id === id)!
              row[field as keyof Row] = value
            })
          }
        />
      </DataGridContainer>
      {!equals(rows, schedule.rows) && (
        <DataChangeBar
          onDiscard={() => setRows(schedule.rows)}
          onSave={alert}
        />
      )}
    </>
  )
}

export default Schedule
