import * as NOTE from '@/modules/note'
import { Note } from '@/types/note'
import { EditorState } from 'draft-js'
import { map } from 'ramda'
import { Dispatch, SetStateAction, useState } from 'react'
import { useEventListener } from 'usehooks-ts'
import useProjects from './useProjects'

const useNotes = () => {
  const { project } = useProjects()

  const [notes, setNotes] = useState<Note[]>(NOTE.initialState)

  useEventListener('storage', () => setNotes(NOTE.initialState))

  useEventListener('local-storage', () => setNotes(NOTE.initialState))

  const workingNote = notes.find(
    (note) => note.project === project.name && note.selected
  )!

  const workingNotes = notes.filter((note) => note.project === project.name)

  const storeNotes: Dispatch<SetStateAction<Note[]>> = (value) => {
    localStorage.setItem(
      'notes',
      JSON.stringify(
        map(NOTE.serialize, typeof value === 'function' ? value(notes) : value)
      )
    )
    dispatchEvent(new Event('local-storage'))
    setNotes(typeof value === 'function' ? value(notes) : value)
  }

  const storeEditorState: Dispatch<SetStateAction<EditorState>> = (value) =>
    storeNotes(
      NOTE.calculateSubState(
        typeof value === 'function'
          ? value(workingNote.editorState as EditorState)
          : value,
        project
      )
    )

  return {
    note: workingNote,
    notes: workingNotes,
    setNotes: storeNotes,
    editorState: workingNote.editorState as EditorState,
    setEditorState: storeEditorState,
  }
}

export default useNotes
