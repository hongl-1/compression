import json from '@rollup/plugin-json'
console.log(process.env.NODE_ENV)
export default {
  input: 'src/index.js',
  output: [
    {
      file: './lib/bundle.esm.js',
      format: 'esm'
    },
    {
      file: './lib/bundle.cjs.js',
      format: 'cjs'
    }
  ],
  plugins: [json()]
}
