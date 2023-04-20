import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { Dispatch, SetStateAction, useState } from 'react'

const useEditorState = () => {
  const [initialEditorState, setInitialEditorState] = useState(() =>
    localStorage.getItem('note')
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(localStorage.getItem('note')!))
        )
      : EditorState.createEmpty()
  )

  const setEditorState: Dispatch<SetStateAction<EditorState>> = (value) => {
    if (typeof value === 'function') {
      const previousValue = value(initialEditorState)
      localStorage.setItem(
        'note',
        JSON.stringify(convertToRaw(previousValue.getCurrentContent()))
      )
      setInitialEditorState(previousValue)
    } else {
      localStorage.setItem(
        'note',
        JSON.stringify(convertToRaw(value.getCurrentContent()))
      )
      setInitialEditorState(value)
    }
  }

  return {
    editorState: initialEditorState,
    setEditorState,
  }
}
export default useEditorState
