import { Command } from 'commander'
import tinify from 'tinify'
import fs from 'fs'
import os from 'os'
import { join } from 'path'
import { collectionFileQueue, tinyImageContent } from './util.js'
const rcPath = join(os.homedir(), '.tinyrc')

const apiKey = fs.readFileSync(rcPath, 'utf-8')

if (!apiKey) {
  console.log(`当前未设置apiKey, 请使用命令 'tiny key set [apiKey]' 设置`)
  process.exit(0)
}
tinify.key = apiKey

const error = console.error
const program = new Command()

program
  .command('key')
  .description('设置key相关的操作')
  .argument('<type>', '操作类型')
  .argument('[apiKey]', 'api key')
  .action((type, apiKey) => {
    switch (type) {
      case 'set':
        if (!apiKey) {
          error('请输入第二个参数apiKey')
          process.exit(1) // To exit with a 'failure' code
        }
        fs.writeFileSync(rcPath, apiKey)
        break
      case 'del':
        if (fs.existsSync(rcPath)) {
          fs.writeFileSync(rcPath, '')
        }
        break
      default:
        break
    }
  })

const queue = []

program.argument('<filePath or dirPath>', '文件或文件夹路径').action((path) => {
  console.log('文件压缩程序正在执行中, 请耐心等候')
  const basePath = process.cwd()
  collectionFileQueue(join(basePath, path), queue)
  process.nextTick(() => {
    tinyImageContent(queue)
  })
})

program.parse(process.argv)
