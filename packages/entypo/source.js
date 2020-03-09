const glob = require('tiny-glob')
const fs = require('fs-extra')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('entypo/package.json'))
  const sourceFiles = await glob('src/Entypo/*.svg', {cwd: baseDir, absolute: true})

  return sourceFiles.map(filename => {
    const match = filename.match(/([^\/]+)\.svg$/)
    const originalName = match[1].replace('%', '-percent')
    return {
      originalName,
      source: fs.readFileSync(filename).toString(),
      pack: 'entypo',
      width: '20',
      height: '20',
    }
  })
}
