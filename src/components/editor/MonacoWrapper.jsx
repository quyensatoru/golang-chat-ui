import React from 'react'
import Editor from '@monaco-editor/react'

const MonacoWrapper = React.forwardRef(({ language = 'javascript', value = '', onChange, theme = 'vs-dark', height = '100%' }, ref) => {
  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={onChange}
      theme={theme}
      onMount={(editor) => { if (ref) ref.current = editor }}
    />
  )
})

MonacoWrapper.displayName = 'MonacoWrapper'

export default MonacoWrapper
