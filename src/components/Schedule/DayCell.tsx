import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { IconButton, Stack, Typography } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { Dispatch, SetStateAction } from 'react'
import * as ROW from '../../modules/row'
import { Row } from '../../types/row'

interface DayCellProps extends GridRenderCellParams {
  rows: Row[]
  setRows: Dispatch<SetStateAction<Row[]>>
}

const DayCell = ({ id, value, rows, setRows }: DayCellProps) => (
  <Stack
    direction='row'
    justifyContent='space-between'
    alignItems='center'
    width='100%'
  >
    <Typography>{value}</Typography>
    {id === value ? (
      <IconButton size='small' onClick={() => setRows(ROW.add(id, rows))}>
        <AddIcon fontSize='small' />
      </IconButton>
    ) : (
      <IconButton size='small' onClick={() => setRows(ROW.remove(id, rows))}>
        <RemoveIcon fontSize='small' />
      </IconButton>
    )}
  </Stack>
)

export default DayCell
