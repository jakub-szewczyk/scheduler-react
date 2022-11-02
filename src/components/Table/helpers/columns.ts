import { GridColDef } from '@mui/x-data-grid'
import { Dispatch, SetStateAction } from 'react'
import { Row } from '../types/Table.types'
import renderDayCell from './renderDayCell'
import renderNotificationCell from './renderNotificationCell'

const columns = (
  rows: Row[],
  setRows: Dispatch<SetStateAction<Row[]>>
): GridColDef[] => [
  {
    field: 'day',
    headerName: 'Day',
    sortable: false,
    width: 150,
    renderCell: renderDayCell(rows, setRows),
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
    renderCell: renderNotificationCell(rows, setRows),
  },
]

export default columns
