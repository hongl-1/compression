import { join } from 'path'
import { createRequire } from 'module'
import os from 'os'
import chalk from 'chalk'
import axios from 'axios'
import { getKey } from './tiny.js'

export const error = console.error

export const log = console.log

export const rcPath = join(os.homedir(), '.tinyrc')

export const cmdTips = chalk.white.underline('tiny key set [apiKey]')

export function progress(progressInfo) {
  return chalk.white.bold(`${progressInfo.current}/${progressInfo.count}`)
}

export function keyTips() {
  log(`当前未设置apiKey, 请使用命令 ${cmdTips} 设置`)
}

export const requireFile = createRequire(import.meta.url)