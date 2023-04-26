import Note from '@/components/Note/Note'
import NoteActions from '@/components/NoteActions/NoteActions'
import { Editor } from 'draft-js'
import { useRef } from 'react'

const Notes = () => {
  const editorRef = useRef<Editor>(null)

  return (
    <>
      <Note ref={editorRef} />
      <NoteActions ref={editorRef} />
    </>
  )
}

export default Notes
