import * as NOTE from '@/modules/note'
import { Note } from '@/types/note'
import { EditorState } from 'draft-js'
import { map } from 'ramda'
import { Dispatch, SetStateAction, useState } from 'react'

/**
 * NOTE:
 * To avoid data synchronization errors when reusing this hook in different parts of code,
 * it's recommended to treat it as a singleton, so that there's only one source of truth.
 * If there is a need to invoke this hook multiple times, consider using the Event API,
 * as demonstrated in the `useLocalStorage` hook from the usehooks-ts library (https://usehooks-ts.com/react-hook/use-local-storage).
 * This approach dispatches a custom event across all instances of the hook, ensuring that the data remains synchronized.
 */
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
