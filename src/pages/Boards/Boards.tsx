import { Container } from '@/components/Project/styles/Project.styles'
import { getBoard, getBoards } from '@/services/board'
import { Status } from '@/types/status'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useImmer } from 'use-immer'
import Board from '../../components/Board/Board'
import BoardActions from '../../components/BoardActions/BoardActions'

type Params = {
  projectId: string
  boardId: string
}

const Boards = () => {
  const [statuses, setStatuses] = useImmer<Status[]>([])

  const [searchParams] = useSearchParams()

  const params = useParams<Params>()

  const navigate = useNavigate()

  useQuery(
    ['projects', params.projectId, 'boards'],
    () => getBoards({ projectId: params.projectId! }),
    {
      enabled: !params.boardId,
      onSuccess: (boards) =>
        !params.boardId &&
        navigate(
          {
            pathname: `/projects/${params.projectId}/boards/${boards.content[0].id}`,
            search: searchParams.toString(),
          },
          { replace: true }
        ),
    }
  )

  const {
    data: board,
    isLoading: isBoardLoading,
    isError: isBoardFetchedUnsuccessfully,
  } = useQuery(
    ['projects', params.projectId, 'boards', params.boardId],
    () =>
      getBoard({
        projectId: params.projectId!,
        boardId: params.boardId!,
      }),
    {
      enabled: !!params.boardId,
      onSuccess: (board) => setStatuses(board.statuses),
    }
  )

  /**
   * TODO:
   * Test loading and error states.
   */
  if (isBoardLoading || statuses.length === 0)
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress />
      </Box>
    )

  /**
   * TODO:
   * Improve error display.
   */
  if (isBoardFetchedUnsuccessfully)
    return (
      <Container>
        <Typography color='error'>
          Something went wrong. Please try again.
        </Typography>
      </Container>
    )

  return (
    <>
      <Board board={board} statuses={statuses} setStatuses={setStatuses} />
      <BoardActions board={board} />
    </>
  )
}

export default Boards
