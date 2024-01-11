import { ProjectContainer } from '@/components/Project/styles/Project.styles'
import { getAllBoards, getBoard } from '@/services/board'
import { getProjects } from '@/services/project'
import { Status } from '@/types/status'
import { useAuth } from '@clerk/clerk-react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useImmer } from 'use-immer'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import Board from '../../components/Board/Board'
import BoardActions from '../../components/BoardActions/BoardActions'

const Boards = () => {
  const [statuses, setStatuses] = useImmer<Status[]>([])

  const selectedProjectId = useReadLocalStorage<string | null>(
    'selectedProjectId'
  )

  const [selectedBoardId, setSelectedBoardId] = useLocalStorage<string | null>(
    'selectedBoardId',
    null
  )

  const { getToken } = useAuth()

  const { data: projects, isSuccess: isEachProjectFetchedSuccessfully } =
    useQuery(['projects'], async () => getProjects(await getToken()))

  const { data: boards, isSuccess: isEachBoardFetchedSuccessfully } = useQuery(
    ['projects', selectedProjectId, 'boards'],
    async () =>
      getAllBoards({
        projectId: selectedProjectId!,
        token: await getToken(),
      }),
    {
      enabled:
        !!selectedProjectId &&
        isEachProjectFetchedSuccessfully &&
        projects.map((project) => project.id).includes(selectedProjectId),
      onSuccess: (boards) => {
        if (
          selectedBoardId &&
          boards.map((board) => board.id).includes(selectedBoardId)
        )
          return
        setSelectedBoardId(boards[0].id)
      },
    }
  )

  const {
    data: board,
    isLoading: isBoardLoading,
    isSuccess: isBoardFetchedSuccessfully,
    isError: isBoardFetchedWithError,
  } = useQuery(
    ['projects', selectedProjectId, 'boards', selectedBoardId],
    async () =>
      getBoard({
        projectId: selectedProjectId!,
        boardId: selectedBoardId!,
        token: await getToken(),
      }),
    {
      enabled:
        !!selectedBoardId &&
        isEachBoardFetchedSuccessfully &&
        boards.map((board) => board.id).includes(selectedBoardId),
      onSuccess: (board) => setStatuses(board.statuses),
    }
  )

  /**
   * TODO:
   * Test loading and error states.
   */
  if (isBoardLoading || (!isBoardFetchedSuccessfully && statuses.length === 0))
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

  if (isBoardFetchedWithError)
    return (
      <ProjectContainer>
        <Typography color='error'>
          Something went wrong. Please try again.
        </Typography>
      </ProjectContainer>
    )

  return (
    <>
      <Board board={board} statuses={statuses} setStatuses={setStatuses} />
      <BoardActions board={board} />
    </>
  )
}

export default Boards
