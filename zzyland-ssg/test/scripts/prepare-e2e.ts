import fse from 'fs-extra'
import path from 'path'
import * as execa from 'execa'

const exmapleDir = path.resolve(__dirname, '../e2e/playground/basic')
const defaultExecaopts = {
  cwd: exmapleDir,
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
}
const ROOT = path.resolve(__dirname, '..')

async function prepareE2E() {
  if (fse.existsSync(path.resolve(__dirname, '../dist'))) {
    execa.commandSync('yarn build', {
      cwd: ROOT
    })
  }
  execa.commandSync('npx playwright install', {
    // ...defaultExecaopts,
    cwd: ROOT
  })
  //   execa.commandSync('yarn install', defaultExecaopts)
  execa.commandSync('yarn dev', defaultExecaopts)
}

prepareE2E()
