import { DataGrid, GridEventListener } from '@mui/x-data-grid'
import { useLocalStorage } from 'usehooks-ts'
import initialRows from './constants/initialRows'
import DayCell from './DayCell'
import updateRowField from './functions/updateRowField'
import NotificationCell from './NotificationCell'
import DataGridWrapper from './styled/DataGridWrapper.styled'

const Table = () => {
  const [rows, setRows] = useLocalStorage('rows', initialRows)

  const handleCellEditCommit:
    | GridEventListener<'cellEditCommit'>
    | undefined = ({ field, value, id }) =>
    setRows(updateRowField(field, value, id, rows))

  return (
    <DataGridWrapper height={56 + 52 * rows.length + 53}>
      <DataGrid
        columns={[
          {
            field: 'day',
            headerName: 'Day',
            sortable: false,
            width: 150,
            renderCell: (params) => (
              <DayCell {...params} rows={rows} setRows={setRows} />
            ),
          },
          {
            field: 'starts',
            headerName: 'Starts',
            sortable: false,
            editable: true,
            width: 100,
          },
          {
            field: 'ends',
            headerName: 'Ends',
            sortable: false,
            editable: true,
            width: 100,
          },
          {
            field: 'room',
            headerName: 'Room',
            sortable: false,
            editable: true,
            width: 125,
          },
          {
            field: 'subject',
            headerName: 'Subject',
            sortable: false,
            editable: true,
            minWidth: 400,
          },
          {
            field: 'notification',
            headerName: 'Notification',
            sortable: false,
            editable: false,
            renderCell: (params) => (
              <NotificationCell {...params} rows={rows} setRows={setRows} />
            ),
          },
        ]}
        rows={rows}
        onCellEditCommit={handleCellEditCommit}
      />
    </DataGridWrapper>
  )
}

export default Table
