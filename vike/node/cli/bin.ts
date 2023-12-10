import { cac } from 'cac'
import { execSync } from 'child_process'
import { resolve } from 'path'
import { resolveConfig } from 'vite'
import { getServerEntry } from '../plugin/plugins/serverEntryPlugin.js'
import { logViteAny } from '../plugin/shared/loggerNotProd.js'
import { prerenderForceExit, prerenderFromCLI } from '../prerender/runPrerender.js'
import { assertUsage, projectInfo } from './utils.js'

const cli = cac(projectInfo.projectName)

cli
  .command('prerender', 'Pre-render the HTML of your pages', { allowUnknownOptions: true })
  .option('--configFile <path>', '[string] Path to vite.config.js')
  .action(async (options) => {
    assertOptions()
    const { partial, noExtraDir, base, parallel, outDir, configFile } = options
    const root = options.root && resolve(options.root)
    await prerenderFromCLI({ partial, noExtraDir, base, root, parallel, outDir, configFile })
    prerenderForceExit()
  })

cli
  .command('[root]', 'Start the development server', { allowUnknownOptions: true })
  .alias('serve') // the command is called 'serve' in Vite's API
  .alias('dev') // alias to align with the script name
  .option('--host [host]', `[string] specify hostname`)
  .option('--port <port>', `[number] specify port`)
  .option('--open [path]', `[boolean | string] open browser on startup`)
  .option('--cors', `[boolean] enable CORS`)
  .option('--strictPort', `[boolean] exit if specified port is already in use`)
  .option('--force', `[boolean] force the optimizer to ignore the cache and re-bundle`)
  .action(async (root, options) => {
    logViteAny('Starting development server', 'info', null, true)

    await resolveConfig({}, 'serve')
    const serverEntry = getServerEntry()
    if (!serverEntry) {
      let command = 'vite dev'
      if (root) {
        command = command + ` ${root}`
      }
      for (const [key, value] of Object.entries(options).slice(1)) {
        command = command + ` --${key}=${value}`
      }

      try {
        execSync(command, { stdio: 'inherit' })
      } catch (error) {
        // { stdio: 'inherit' } already logged the error
      }
      return
    }

    const scriptPath = 'node_modules/vike/dist/esm/node/dev/startDevServer.js'
    function onRestart() {
      try {
        execSync(`node ${scriptPath}`, { stdio: 'inherit' })
      } catch (error) {
        if (error && typeof error === 'object' && 'status' in error && error.status === 33) {
          onRestart()
        }
        // { stdio: 'inherit' } already logged the error
      }
    }

    onRestart()
  })

function assertOptions() {
  // Using process.argv because cac convert names to camelCase
  const rawOptions = process.argv.slice(3)
  Object.values(rawOptions).forEach((option) => {
    assertUsage(
      !option.startsWith('--') ||
        [
          '--root',
          '--partial',
          '--noExtraDir',
          '--clientRouter',
          '--base',
          '--parallel',
          '--outDir',
          '--configFile'
        ].includes(option),
      'Unknown option: ' + option
    )
  })
}

// Listen to unknown commands
cli.on('command:*', () => {
  assertUsage(false, 'Unknown command: ' + cli.args.join(' '))
})

cli.help()
cli.version(projectInfo.projectVersion)

cli.parse(process.argv.length === 2 ? [...process.argv, '--help'] : process.argv)

process.on('unhandledRejection', (rejectValue) => {
  throw rejectValue
})
