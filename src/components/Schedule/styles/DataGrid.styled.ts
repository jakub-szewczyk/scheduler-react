import { Paper, styled } from '@mui/material'
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid'
import * as TABLE from '../../../modules/table'

const DataGrid = styled(MuiDataGrid)(({ theme }) => ({
  border: 0,
  fontSize: 16,
  '.MuiDataGrid-columnHeader:last-child': {
    '.MuiDataGrid-columnSeparator--sideRight': {
      visibility: 'hidden',
    },
  },
  '.MuiDataGrid-columnHeaderTitleContainer': {
    paddingInline: 8,
  },
  '.MuiDataGrid-cell': {
    paddingInline: 16,
  },
  '.MuiDataGrid-footerContainer': {
    borderTop: 0,
  },
  '.MuiDataGrid-virtualScroller': {
    overflowY: 'hidden',
    '::-webkit-scrollbar': {
      width: 4,
      height: 4,
    },
    '::-webkit-scrollbar-track': {
      background: theme.palette.secondary.light,
      borderRadius: theme.shape.borderRadius,
    },
    '::-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main,
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        background: theme.palette.primary.dark,
      },
    },
    '::-webkit-scrollbar-corner': {
      display: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      '::-webkit-scrollbar': {
        width: 8,
        height: 8,
      },
    },
  },
  '.MuiDataGrid-virtualScrollerContent--overflowed .MuiDataGrid-row--lastVisible .MuiDataGrid-cell':
    {
      borderBottomColor: '#515151',
    },
  '.MuiTablePagination-selectLabel, .MuiToolbar-root, .MuiTablePagination-displayedRows':
    {
      fontSize: 16,
    },
}))

const DataGridContainer = styled(Paper)<{ height: number }>(
  ({ theme, height }) => ({
    width: 'calc(100% - 32px)',
    height,
    margin: '1rem auto',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      width: 'calc(100% - 48px)',
      marginBlock: '1.5rem',
    },
    '.MuiDataGrid-footerContainer': {
      height: TABLE.FOOTER_HEIGHT,
    },
  })
)

export { DataGrid, DataGridContainer }
