import { GridColDef } from '@mui/x-data-grid'
import { Dispatch, SetStateAction } from 'react'
import DayCell from '../DayCell'
import NotificationCell from '../../layout/NotificationIcon/NotificationCell'
import TimeCell from '../TimeCell'
import { Row } from '../types/Schedule.types'

const createColumns = (
  rows: Row[],
  setRows: Dispatch<SetStateAction<Row[]>>
): GridColDef[] => [
  {
    field: 'day',
    headerName: 'Day',
    sortable: false,
    width: 155,
    renderCell: (params) => (
      <DayCell {...params} rows={rows} setRows={setRows} />
    ),
  },
  {
    field: 'starts',
    headerName: 'Starts',
    sortable: false,
    width: 155,
    renderCell: (params) => (
      <TimeCell {...params} rows={rows} setRows={setRows} />
    ),
  },
  {
    field: 'ends',
    headerName: 'Ends',
    sortable: false,
    width: 155,
    renderCell: (params) => (
      <TimeCell {...params} rows={rows} setRows={setRows} />
    ),
  },
  {
    field: 'room',
    headerName: 'Room',
    sortable: false,
    editable: true,
    width: 155,
  },
  {
    field: 'subject',
    headerName: 'Subject',
    sortable: false,
    editable: true,
    width: 400,
  },
  {
    field: 'notification',
    headerName: 'Notification',
    sortable: false,
    editable: false,
    width: 100,
    renderCell: (params) => (
      <NotificationCell {...params} rows={rows} setRows={setRows} />
    ),
  },
]

export default createColumns
