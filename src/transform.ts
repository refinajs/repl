import { File, Store } from './store'
import { transpileModule } from 'typescript/lib/typescript'

const transformed: string[] = []

export async function compileFile(
  store: Store,
  { filename, code, compiled, language }: File
): Promise<(string | Error)[]> {
  if (language === 'typescript' || language === 'javascript') {
    if (/^(((^|\n)\s*\/\/[^\n]*)|\n)*\s*\/\/\s*@refina-ignore/.test(code)) {
      compiled.js = code
      return []
    }
    let fileIdx = transformed.findIndex((f) => f === filename)
    fileIdx = fileIdx === -1 ? transformed.push(filename) - 1 : fileIdx
    compiled.js =
      store.compiler(
        code,
        (idx) => `${fileIdx.toString(36)}-${idx.toString(36)}`
      ) ?? code

    if (language === 'typescript') {
      compiled.js = transpileModule(
        compiled.js,
        store.getTsConfig?.()
      ).outputText
    }
  } else {
    compiled.js = '/* Not a TS/JS file */\n'
    if (language === 'css') {
      compiled.css = code
    }
  }
  return []
}
