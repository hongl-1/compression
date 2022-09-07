import { Command } from 'commander'
import { join } from 'path'
import { allowExtList, checkKey, collectionFileQueue, tinyImageContent } from './tiny.js'
import { keyCommander } from './key.commander.js'
import { log, requireFile } from './util.js'
import figlet from 'figlet'

const program = new Command()
const fileListQueue = []
let progressInfo = {
  count: 0,
  current: 1
}

program
  .command('key')
  .description('设置key相关的操作')
  .argument('<type>', '操作类型')
  .argument('[apiKey]', 'api key')
  .action((type, apiKey) => {
    keyCommander(type, apiKey)
  })

program.argument('<filePath or dirPath>', '文件或文件夹路径').action(async (path) => {
  checkKey()
  log(figlet.textSync('tiny  running', {
    font: 'Ogre',
  }))
  log(`此程序会收集并压缩${allowExtList.join('、')}文件\n文件压缩程序正在执行中，请耐心等候...`)
  const basePath = process.cwd()
  collectionFileQueue(join(basePath, path), fileListQueue)
  progressInfo = {
    count: fileListQueue.length,
    current: 0
  }
  console.log(`文件收集完成，共有${progressInfo.count}个文件压缩任务`)
  tinyImageContent(fileListQueue, progressInfo)
})


const pkg = requireFile('../package.json')

program.version(pkg.version)

program.parse(process.argv)
