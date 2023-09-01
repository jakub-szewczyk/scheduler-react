import { GridColDef } from '@mui/x-data-grid'
import { Updater } from 'use-immer'
import { Row } from '../../../types/row'
import DayCell from '../DayCell'
import NotificationCell from '../NotificationCell'
import TimeCell from '../TimeCell'

const createColumns = (setRows: Updater<Row[]>): GridColDef[] => [
  {
    field: 'day',
    headerName: 'Day',
    sortable: false,
    width: 155,
    renderCell: (params) => <DayCell {...params} setRows={setRows} />,
  },
  {
    field: 'starts',
    headerName: 'Starts',
    sortable: false,
    width: 165,
    renderCell: (params) => <TimeCell {...params} setRows={setRows} />,
  },
  {
    field: 'ends',
    headerName: 'Ends',
    sortable: false,
    width: 165,
    renderCell: (params) => <TimeCell {...params} setRows={setRows} />,
  },
  {
    field: 'room',
    headerName: 'Room',
    sortable: false,
    editable: true,
    width: 165,
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
    width: 118,
    renderCell: (params) => <NotificationCell {...params} setRows={setRows} />,
  },
]

export default createColumns
