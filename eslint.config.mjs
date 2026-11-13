import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'
import config from '@dhis2/config-eslint/react'
import { defineConfig } from 'eslint/config'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig([
    includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
    {
        extends: [config],
    },
    {
        settings: {
            // react-native ships Flow source, which eslint-plugin-import cannot
            // parse; skip it when checking imports.
            'import/ignore': ['node_modules/react-native/'],
        },
    },
])
