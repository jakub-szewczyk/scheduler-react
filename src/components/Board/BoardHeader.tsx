import useBoards from '@/hooks/useBoards'
import * as BOARD from '@/modules/board'
import { asteriskSuffix } from '@/modules/common'
import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Stack, Typography } from '@mui/material'
import { pipe } from 'fp-ts/lib/function'
import { trim } from 'ramda'
import { useBoolean } from 'usehooks-ts'
import SaveBoardDialog from '../BoardActions/SaveBoardDialog'

const BoardHeader = () => {
  const { board, boards, setBoards } = useBoards()

  const {
    value: isSaveBoardDialogOpen,
    setFalse: closeSaveBoardDialog,
    setTrue: openSaveBoardDialog,
  } = useBoolean()

  const handleBoardSave = ({ name }: { name: string }) => {
    setBoards(pipe(name, trim, BOARD.save))
    closeSaveBoardDialog()
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
        <IconButton size='small' onClick={openSaveBoardDialog}>
          <EditIcon fontSize='small' />
        </IconButton>
        <Typography maxWidth={(theme) => theme.breakpoints.values.sm} noWrap>
          {asteriskSuffix(board.name)}
        </Typography>
      </Stack>
      <SaveBoardDialog
        open={isSaveBoardDialogOpen}
        onClose={closeSaveBoardDialog}
        board={board}
        boards={boards}
        onSave={handleBoardSave}
      />
    </>
  )
}
export default BoardHeader
