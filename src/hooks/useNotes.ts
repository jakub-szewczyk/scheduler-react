import * as NOTE from '@/modules/note'
import { Note } from '@/types/note'
import { EditorState, convertToRaw } from 'draft-js'
import { Dispatch, SetStateAction, useState } from 'react'

const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(NOTE.initialState)

  const setEditorState: Dispatch<SetStateAction<EditorState>> = (value) => {
    localStorage.setItem(
      'notes',
      JSON.stringify(
        NOTE.updatedState(value)(notes).map((note) => ({
          ...note,
          editorState: convertToRaw(
            (note.editorState as EditorState).getCurrentContent()
          ),
        }))
      )
    )
    setNotes(NOTE.updatedState(value))
  }

  const note = notes.find((note) => note.selected)!

  return {
    note,
    notes,
    setNotes,
    editorState: note.editorState as EditorState,
    setEditorState,
  }
}

export default useNotes
