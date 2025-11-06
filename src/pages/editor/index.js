import React, { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import Editor from '@monaco-editor/react'
import MonacoWrapper from '../../components/editor/MonacoWrapper'

const initialCodeMap = {
    javascript: `function hello() {\n  console.log('Hello, Monaco!')\n}\n\nhello();\n`,
    typescript: `function hello(): void {\n  console.log('Hello, TypeScript!')\n}\n\nhello();\n`,
    html: `<!doctype html>\n<html>\n  <body>\n    <h1>Hello</h1>\n  </body>\n</html>\n`,
    css: `body {\n  font-family: system-ui;\n}\n`,
    json: `{
  "hello": true
}\n`,
}

export default function EditorPage() {
    const editorRef = useRef(null)
    const [language, setLanguage] = useState('javascript')

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor
    }

    async function formatCode() {
        if (!editorRef.current) return
        const code = editorRef.current.getValue()

        try {
            const prettier = await import('prettier/standalone')
            let parserModule
            switch (language) {
                case 'typescript':
                    parserModule = await import('prettier/parser-typescript')
                    break
                case 'javascript':
                    parserModule = await import('prettier/parser-babel')
                    break
                case 'css':
                    parserModule = await import('prettier/parser-postcss')
                    break
                case 'html':
                    parserModule = await import('prettier/parser-html')
                    break
                case 'json':
                    parserModule = await import('prettier/parser-babel')
                    break
                default:
                    parserModule = await import('prettier/parser-babel')
            }

            const formatted = prettier.format(code, { parser: language === 'json' ? 'json' : language === 'html' ? 'html' : language === 'css' ? 'css' : language === 'typescript' ? 'typescript' : 'babel', plugins: [parserModule] })
            editorRef.current.setValue(formatted)
        } catch (err) {
            console.error('Formatting failed:', err)
            // fallback: do nothing
        }
    }

    return (
        <div className="flex-1 p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Editor</CardTitle>
                        <div className="flex items-center gap-2">
                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-md border px-2 py-1 text-sm">
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="json">JSON</option>
                            </select>
                            <button onClick={formatCode} className="rounded-md bg-primary px-3 py-1 text-sm text-white">Format</button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[480px]">
                        <Editor height="100%" defaultLanguage={language} defaultValue={initialCodeMap[language]} theme="vs-dark" onMount={handleEditorDidMount} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
