import fs from 'fs'
import { join, extname } from 'path'
import tinify from 'tinify'
import { cmdTips, keyTips, log, progress, rcPath } from './util.js'
import chalk from 'chalk'
import dayjs from 'dayjs'

// 允许上传的拓展名列表
export const allowExtList = ['.webp', '.jpg', '.png', '.jpeg']

export function collectionFileQueue(path, queue) {
  const fileStat = fs.statSync(path)
  if (fileStat.isDirectory()) {
    const fileList = fs.readdirSync(path)
    for (let i = 0; i < fileList.length; i++) {
      collectionFileQueue(join(path, fileList[i]), queue)
    }
  } else if (fileStat.isFile()) {
    const extName = extname(path) || ''
    if(allowExtList.includes(extName.toLowerCase())){
      queue.push(path)
    }
  }
}

export function tinyImageContent(queue, progressInfo) {
  if (!queue.length) process.exit(0)
  const tinyInfo = {
    originSize: 0,
    resultSize: 0,
    expendTime: 0,
    apiKey: getKey(),
    isFail: false,
    failReason: ''
  }
  const startTime = dayjs()
  const path = queue.shift()
  progressInfo.current++
  log(`${progress(progressInfo)} -- ${path}: 开始执行压缩任务`)
  fs.readFile(path, function (err, sourceData) {
    tinyInfo.originSize = sourceData.length
    if (err) throw err
    log(`${progress(progressInfo)} -- ${path}: 读取文件完成`)
    tinify.fromBuffer(sourceData).toBuffer(function (err, resultData) {
      if (err) {
        if (err.message.startsWith('Credentials are invalid.')) {
          log(`当前apiKey无效, 请使用命令 ${cmdTips} 重新设置`)
          process.exit(0)
        }
        tinyInfo.isFail = true
        tinyInfo.failReason = err.message
        log(`${progress(progressInfo)} -- ${path}: ${chalk.red('压缩失败, 原因: ' + err.message)}`)
      } else {
        tinyInfo.resultSize = resultData.length
        log(`${progress(progressInfo)} -- ${path}: 压缩完成, 开始写入文件`)
        fs.writeFileSync(path, resultData)
        log(`${progress(progressInfo)} -- ${path}: ${chalk.green('文件已压缩完成')}`)
        tinyInfo.expendTime = dayjs(dayjs()).diff(dayjs(startTime), 'ms')
      }
      tinyImageContent(queue, progressInfo)
    })
  })
}

let key = ''
export function getKey() {
  if(!key && fs.existsSync(rcPath)) {
    key = fs.readFileSync(rcPath, 'utf-8')
  }
  return key
}

export function checkKey() {
  const apiKey = getKey()
  if (!apiKey) {
    keyTips()
    process.exit(0)
  }
  tinify.key = apiKey
}
