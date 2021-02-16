const glob = require('tiny-glob')
const fs = require('fs')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('boxicons'))
  const sourceFiles = await glob('../svg/regular/*.svg', {cwd: baseDir, absolute: true})

  return sourceFiles.map((filename) => {
    const match = filename.match(/bx-([^}]+)\.svg$/)
    const cleanedName = match[1].trim()
    return {
      originalName: cleanedName === 'package' ? 'package-icon' : cleanedName,
      source: fs.readFileSync(filename).toString(),
      pack: 'boxicons-regular',
      width: '24',
      height: '24',
    }
  })
}
