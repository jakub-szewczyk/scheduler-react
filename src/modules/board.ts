import { Board } from '@/types/board'

export const initialValues = (mode: 'CREATE' | 'EDIT', board: Board) => ({
  name: mode === 'EDIT' ? board.name || '' : '',
})
