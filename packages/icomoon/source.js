const glob = require('tiny-glob')
const fs = require('fs-extra')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('@svg-icons/icomoon-source/IcoMoon-Free.json'))
  const sourceFiles = await glob('SVG/*.svg', {cwd: baseDir, absolute: true})

  return sourceFiles.map(filename => {
    const match = filename.match(/\d+-([^}]+)\.svg$/)
    return {
      originalName: match[1] === 'pagebreak' ? 'pagebreak2' : match[1].toLowerCase(),
      source: fs.readFileSync(filename).toString(),
      pack: 'icomoon',
      width: '16',
      height: '16',
    }
  })
}
