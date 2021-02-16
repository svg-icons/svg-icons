const glob = require('tiny-glob')
const fs = require('fs')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('typicons.font/package.json'))
  const sourceFiles = await glob('src/svg/*.svg', {cwd: baseDir, absolute: true})

  return sourceFiles.map((filename) => {
    const match = filename.match(/([^\/]+)\.svg$/)
    return {
      originalName: match[1],
      source: fs.readFileSync(filename).toString(),
      pack: 'typicons',
      width: '24',
      height: '24',
    }
  })
}
