const glob = require('tiny-glob')
const fs = require('fs-extra')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('zondicons/package.json'))
  const sourceFiles = await glob('*.svg', {cwd: baseDir, absolute: true})

  return sourceFiles.map(filename => {
    const match = filename.match(/([^\/]+)\.svg$/)
    return {
      originalName: match[1],
      source: fs.readFileSync(filename).toString(),
      pack: 'zondicons',
      width: '20',
      height: '20',
    }
  })
}
