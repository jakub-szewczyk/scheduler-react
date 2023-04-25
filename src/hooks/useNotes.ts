import * as NOTE from '@/modules/note'
import { Note } from '@/types/note'
import { EditorState } from 'draft-js'
import { map } from 'ramda'
import { Dispatch, SetStateAction, useState } from 'react'

const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(NOTE.initialState)

  const note = notes.find((note) => note.selected)!

  const storeNotes: Dispatch<SetStateAction<Note[]>> = (value) => {
    localStorage.setItem(
      'notes',
      JSON.stringify(
        map(NOTE.serialize, typeof value === 'function' ? value(notes) : value)
      )
    )
    setNotes(typeof value === 'function' ? value(notes) : value)
  }

  const storeEditorState: Dispatch<SetStateAction<EditorState>> = (value) =>
    storeNotes(
      NOTE.updateEditorState(
        typeof value === 'function'
          ? value(note.editorState as EditorState)
          : value
      )
    )

  return {
    note,
    notes,
    setNotes: storeNotes,
    editorState: note.editorState as EditorState,
    setEditorState: storeEditorState,
  }
}

export default useNotes
