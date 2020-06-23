const glob = require('tiny-glob')
const fs = require('fs-extra')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('entypo/package.json'))
  const sourceFiles = await glob('src/Entypo Social Extension/*.svg', {cwd: baseDir, absolute: true})

  return sourceFiles.map((filename) => {
    const match = filename.match(/([^\/]+)\.svg$/)
    const originalName = match[1].replace('+', '-plus')
    return {
      originalName,
      source: fs.readFileSync(filename).toString(),
      pack: 'entypo-social',
      width: '20',
      height: '20',
    }
  })
}
