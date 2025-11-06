export async function formatWithPrettier(code, language) {
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

    const parserName = language === 'json' ? 'json' : language === 'html' ? 'html' : language === 'css' ? 'css' : language === 'typescript' ? 'typescript' : 'babel'

    const formatted = prettier.format(code, { parser: parserName, plugins: [parserModule] })
    return formatted
  } catch (err) {
    console.error('prettier format error', err)
    throw err
  }
}
