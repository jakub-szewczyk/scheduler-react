import Note from '@/components/Note/Note'
import NoteActions from '@/components/NoteActions/NoteActions'
import useNotes from '@/hooks/useNotes'
import { Editor } from 'draft-js'
import { useRef } from 'react'

const Notes = () => {
  const editorRef = useRef<Editor>(null)

  const notes = useNotes()

  return (
    <>
      <Note ref={editorRef} {...notes} />
      <NoteActions ref={editorRef} {...notes} />
    </>
  )
}

export default Notes
