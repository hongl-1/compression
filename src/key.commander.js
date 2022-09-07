import { error, keyTips, log, rcPath } from './util.js'
import fs from 'fs'
import { getKey } from './tiny.js'

export function keyCommander(type, apiKey) {
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
    case 'view':
      if (fs.existsSync(rcPath)) {
        const apiKey = getKey()
        if(!apiKey) {
          keyTips()
          process.exit(0)
        }
        log(`当前的apiKey: ${apiKey}`)
      }
      break
    default:
      log('当前tiny key <type> [apiKey] 中的type仅支持 set, del, view 命令')
      break
  }
}
