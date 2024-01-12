import ChangesBar from '@/layout/ChangesBar/ChangesBar'
import { updateScheduleRows } from '@/services/row'
import { Row } from '@/types/row'
import { Schedule as ISchedule } from '@/types/schedule'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { equals } from 'ramda'
import { useParams } from 'react-router-dom'
import { Updater } from 'use-immer'
import * as TABLE from '../../modules/table'
import ScheduleHeader from './ScheduleHeader'
import createColumns from './helpers/createColumns'
import { DataGrid, DataGridContainer } from './styles/DataGrid.styled'

type Params = {
  projectId: string
  scheduleId: string
}

interface ScheduleProps {
  schedule: ISchedule
  rows: Row[]
  setRows: Updater<Row[]>
}

const Schedule = ({ schedule, rows, setRows }: ScheduleProps) => {
  const params = useParams<Params>()

  const queryClient = useQueryClient()

  const {
    mutate: updateScheduleRowsMutation,
    isLoading: isUpdatingScheduleRows,
  } = useMutation(updateScheduleRows, {
    onSuccess: () =>
      queryClient.invalidateQueries(
        ['projects', params.projectId, 'schedules', schedule.id],
        { exact: true }
      ),
  })

  const columns = createColumns(setRows)

  const hasChanges = !equals(rows, schedule.rows) || isUpdatingScheduleRows

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
          bgcolor: 'rgba(0, 0, 0, 0.35)',
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
              row[field as keyof Pick<Row, 'room' | 'subject'>] = value
            })
          }
        />
      </DataGridContainer>
      {hasChanges && (
        <ChangesBar
          loading={isUpdatingScheduleRows}
          onDiscard={() => setRows(schedule.rows)}
          onSave={async () =>
            updateScheduleRowsMutation({
              projectId: params.projectId!,
              scheduleId: schedule.id,
              rows,
            })
          }
        />
      )}
    </>
  )
}

export default Schedule
