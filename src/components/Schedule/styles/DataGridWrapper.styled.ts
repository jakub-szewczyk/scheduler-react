import { Box, styled } from '@mui/material'
import * as TABLE from '../../../modules/table'

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
    height: TABLE.FOOTER_HEIGHT,
  },
}))

export default DataGridWrapper
