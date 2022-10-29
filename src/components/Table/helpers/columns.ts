import { GridColDef } from '@mui/x-data-grid'
import { Dispatch, SetStateAction } from 'react'
import { Row } from '../Table.types'
import renderDayCell from './renderDayCell'

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
    field: 'subject',
    headerName: 'Subject',
    sortable: false,
    editable: true,
    width: 200,
  },
]

export default columns
