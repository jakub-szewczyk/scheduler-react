import Note from '@/components/Note/Note'
import NoteActions from '@/components/NoteActions/NoteActions'
import useNotes from '@/hooks/useNotes'
import { Editor } from 'draft-js'
import { useRef } from 'react'

const Notes = () => {
  const editorRef = useRef<Editor>(null)

  const { note, notes, setNotes, editorState, setEditorState } = useNotes()

  return (
    <>
      <Note
        ref={editorRef}
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <NoteActions
        ref={editorRef}
        note={note}
        notes={notes}
        setNotes={setNotes}
      />
    </>
  )
}

export default Notes
