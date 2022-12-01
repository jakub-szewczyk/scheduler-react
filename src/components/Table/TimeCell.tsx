import { TextField } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { DesktopTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Dispatch, SetStateAction } from 'react'
import findRowById from './functions/findRowById'
import updateRowField from './functions/updateRowField'
import { Row } from './types/Table.types'

interface TimeCellProps extends GridRenderCellParams {
  rows: Row[]
  setRows: Dispatch<SetStateAction<Row[]>>
}

const TimeCell = ({ id, field, rows, setRows }: TimeCellProps) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DesktopTimePicker
      value={findRowById(id, rows)![field as keyof Row] || null}
      onChange={(value) => setRows(updateRowField(field, value, id, rows))}
      renderInput={(params) => (
        <TextField
          {...params}
          size='small'
          inputProps={{ ...params.inputProps, placeholder: '' }}
        />
      )}
      OpenPickerButtonProps={{
        size: 'small',
        sx: { translate: 6, svg: { width: 20, height: 20 } },
      }}
    />
  </LocalizationProvider>
)

export default TimeCell
