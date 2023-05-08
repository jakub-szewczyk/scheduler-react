import useSchedules from '../../hooks/useSchedules'
import * as ROW from '../../modules/row'
import * as TABLE from '../../modules/table'
import ScheduleHeader from './ScheduleHeader'
import createColumns from './helpers/createColumns'
import { DataGrid, DataGridContainer } from './styles/DataGrid.styled'

const Schedule = () => {
  const {
    schedule: { rows },
    setRows,
  } = useSchedules()

  const columns = createColumns(rows, setRows)

  return (
    <>
      <ScheduleHeader />
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
            setRows(ROW.update(field, value, id, rows))
          }
        />
      </DataGridContainer>
    </>
  )
}

export default Schedule
