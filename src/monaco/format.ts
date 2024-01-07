import * as monaco from 'monaco-editor-core'
import * as prettier from 'prettier'
import BabelPlugin from 'prettier/plugins/babel'
//@ts-ignore
import EsTreePlugin from 'prettier/plugins/estree'

export async function registerFormatter() {
  const formatProvider = {
    provideDocumentFormattingEdits: async (model, options, _token) => [
      {
        text: await prettier.format(model.getValue(), {
          parser: 'babel',
          plugins: [BabelPlugin, EsTreePlugin],
          arrowParens: 'avoid',
          tabWidth: options.tabSize,
        }),
        range: model.getFullModelRange(),
      },
    ],
  } as monaco.languages.DocumentFormattingEditProvider

  monaco.languages.registerDocumentFormattingEditProvider(
    ['javascript', 'typescript', 'css'],
    formatProvider
  )
}
