const glob = require('tiny-glob')
const fs = require('fs-extra')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('bootstrap-icons/package.json'))
  const sourceFiles = await glob('icons/*.svg', {cwd: baseDir, absolute: true})

  return sourceFiles.map(filename => {
    const match = filename.match(/([^/]+)\.svg$/)
    return {
      originalName: match[1],
      source: fs.readFileSync(filename).toString(),
      pack: 'bootstrap',
      width: '16',
      height: '16',
    }
  })
}
