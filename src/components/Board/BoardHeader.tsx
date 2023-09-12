import { asteriskSuffix } from '@/modules/common'
import { Board } from '@/types/board'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Stack, Typography } from '@mui/material'
import { useBoolean } from 'usehooks-ts'
import UpsertBoardDialog from '../BoardActions/UpsertBoardDialog'

interface BoardHeaderProps {
  board: Board
}

const BoardHeader = ({ board }: BoardHeaderProps) => {
  const {
    value: isEditBoardDialogOpen,
    setFalse: closeEditBoardDialog,
    setTrue: openEditBoardDialog,
  } = useBoolean()

  const handleBoardEdit = ({ name }: { name: string }) => {
    // setBoards(pipe(name, trim, BOARD.save(project)))
    closeEditBoardDialog()
  }

  return (
    <>
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        columnGap={1.5}
        width={{
          xs: 'calc(100% - 32px)',
          sm: 'calc(100% - 48px)',
        }}
        maxWidth={(theme) => theme.breakpoints.values.lg}
        marginX='auto'
      >
        <IconButton size='small' onClick={openEditBoardDialog}>
          <EditIcon fontSize='small' />
        </IconButton>
        <Typography maxWidth={(theme) => theme.breakpoints.values.sm} noWrap>
          {asteriskSuffix(board.name)}
        </Typography>
      </Stack>
      <UpsertBoardDialog
        mode='EDIT'
        open={isEditBoardDialogOpen}
        onClose={closeEditBoardDialog}
        board={board}
        onEdit={handleBoardEdit}
      />
    </>
  )
}
export default BoardHeader
