## tiny-cli

**a cli tool for compress image with tinypng.com**

#### 使用说明
1. `tiny --version` 查看当前版本
2. `tiny key <type> [apiKey]` 对api key的一系列操作
  - type: `set` 需要传入apiKey用来设置cli的全局key
  - type: `view` 查看cli的全局key
  - type: `del` 删除cli的全局key
3. `tiny <dirName>`  dirName: 文件夹名称 会递归遍历该文件夹中的所有指定格式文件(png、jpg、jpeg、webp)，并对文件进行压缩
4. `tiny <fileName>` fileName: 文件名称 对该文件进行压缩处理
