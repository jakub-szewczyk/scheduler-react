import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { Dispatch, SetStateAction, useState } from 'react'

const useNotes = () => {
  const [editorState, setEditorState] = useState(() =>
    localStorage.getItem('note')
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(localStorage.getItem('note')!))
        )
      : EditorState.createEmpty()
  )

  const setNote: Dispatch<SetStateAction<EditorState>> = (value) => {
    if (typeof value === 'function') {
      const previousValue = value(editorState)
      localStorage.setItem(
        'note',
        JSON.stringify(convertToRaw(previousValue.getCurrentContent()))
      )
      setEditorState(previousValue)
    } else {
      localStorage.setItem(
        'note',
        JSON.stringify(convertToRaw(value.getCurrentContent()))
      )
      setEditorState(value)
    }
  }

  return {
    note: editorState,
    setNote,
  }
}
export default useNotes
