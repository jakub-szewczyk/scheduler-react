import ChangesBar from '@/layout/ChangesBar/ChangesBar'
import { updateScheduleRows } from '@/services/row'
import { Row } from '@/types/row'
import { Schedule as ISchedule } from '@/types/schedule'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { equals } from 'ramda'
import { Updater } from 'use-immer'
import { useReadLocalStorage } from 'usehooks-ts'
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
  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const { getToken } = useAuth()

  const queryClient = useQueryClient()

  const {
    mutate: updateScheduleRowsMutation,
    isLoading: isUpdatingScheduleRows,
  } = useMutation(updateScheduleRows, {
    onSuccess: () =>
      queryClient.invalidateQueries(
        ['projects', selectedProjectId, 'schedules', schedule.id],
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
              projectId: selectedProjectId!,
              scheduleId: schedule.id,
              rows,
              token: await getToken(),
            })
          }
        />
      )}
    </>
  )
}

export default Schedule
