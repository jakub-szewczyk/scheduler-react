import { Box, styled } from '@mui/material'
import footerHeight from '../constants/footerHeight'

const DataGridWrapper = styled(Box)<{ height: number }>(({ height }) => ({
  width: '100%',
  height,
  marginInline: 'auto',
  marginTop: 80,
  overflow: 'hidden',
  '.MuiDataGrid-virtualScroller': {
    overflowY: 'hidden',
  },
  '.MuiDataGrid-footerContainer': {
    height: footerHeight,
  },
}))

export default DataGridWrapper
