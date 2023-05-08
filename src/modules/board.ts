import { Board } from '@/types/board'
import { Project } from '@/types/project'
import { Status } from '@/types/status'
import produce from 'immer'

const INITIAL_STATUSES: Status[] = [
  {
    title: 'todo',
    issues: [
      {
        title: 'Adjust column titles',
        content:
          'To rename a status, simply click on the three dots icon next to the status title. This will open the configuration menu, where you can find the option to rename it.',
      },
      {
        title: 'Create your own issues',
        content:
          'Click on the floating action button in the bottom-right corner of the screen to add more issues',
      },
      {
        title: 'Get familiar with the kanban board',
        content:
          'Get to know the kanban board. Customize statuses and issues to fit your needs.',
      },
    ],
  },
  {
    title: 'on hold',
    issues: [],
  },
  {
    title: 'inprogress',
    issues: [],
  },
  {
    title: 'done',
    issues: [],
  },
]

export const initialValues = (): Board[] => [
  {
    name: 'unsaved',
    project: 'unsaved',
    selected: true,
    createdAt: new Date().toISOString(),
    statuses: INITIAL_STATUSES,
  },
]

export const create = (project: Project) =>
  produce((boards: Board[]) => {
    boards.forEach(
      (board) => board.project === project.name && (board.selected = false)
    )
    boards.push({ ...initialValues()[0], project: project.name })
  })

export const remove = (project: Project, name: string) =>
  produce((boards: Board[]) => {
    const boardIndex = boards.findIndex(
      (board) => board.project === project.name && board.name === name
    )
    const [removedBoard] = boards.splice(boardIndex, 1)
    if (removedBoard.selected) {
      const projectBoards = boards.filter(
        (board) => board.project === project.name
      )
      projectBoards[projectBoards.length - 1].selected = true
    }
  })

export const select = (project: Project, name: string) =>
  produce((boards: Board[]) => {
    boards.forEach(
      (board) =>
        board.project === project.name && (board.selected = board.name === name)
    )
  })

export const save = (project: Project) => (name: string) =>
  produce((boards: Board[]) =>
    boards.forEach(
      (board) =>
        board.project === project.name && board.selected && (board.name = name)
    )
  )

export const calculateSubState = (statuses: Status[], project: Project) =>
  produce((boards: Board[]) => {
    const board = boards.find(
      (board) => board.project === project.name && board.selected
    )!
    board.statuses = statuses
  })
