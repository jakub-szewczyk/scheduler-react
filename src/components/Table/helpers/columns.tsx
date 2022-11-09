import { GridColDef } from '@mui/x-data-grid'
import { Dispatch, SetStateAction } from 'react'
import DayCell from '../DayCell'
import NotificationCell from '../NotificationCell'
import { Row } from '../types/Table.types'

const columns = (
  rows: Row[],
  setRows: Dispatch<SetStateAction<Row[]>>
): GridColDef[] => [
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
]

export default columns
