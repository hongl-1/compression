import fs from 'fs'
import { join } from 'path'
import tinify from 'tinify'

export function collectionFileQueue(path, queue) {
  const fileStat = fs.statSync(path)
  if (fileStat.isDirectory()) {
    const fileList = fs.readdirSync(path)
    for (let i = 0; i < fileList.length; i++) {
      collectionFileQueue(join(path, fileList[i]), queue)
    }
  } else if (fileStat.isFile()) {
    queue.push(path)
    // tinyImageContent(path)
  }
}

export function tinyImageContent(queue) {
  if (!queue.length) process.exit(0)
  const path = queue.shift()
  console.log(`${path}: 开始执行压缩任务`)
  fs.readFile(path, function (err, sourceData) {
    if (err) throw err
    console.log(`${path}: 读取文件完成`)
    tinify.fromBuffer(sourceData).toBuffer(function (err, resultData) {
      if (err) {
        if (err.message.startsWith('Credentials are invalid.')) {
          console.log(
            `当前apiKey无效, 请使用命令 'tiny key set [apiKey]' 重新设置`
          )
          process.exit(0)
        }
        console.log(`${path}: 压缩失败, 原因: ${err.message}`)
      } else {
        console.log(`${path}: 压缩完成, 开始写入文件`)
        fs.writeFileSync(path, resultData)
        console.log(`${path}: 文件已压缩完成`)
      }
      tinyImageContent(queue)
      // ...
    })
  })
}
