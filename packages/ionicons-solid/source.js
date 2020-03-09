const glob = require('tiny-glob')
const fs = require('fs-extra')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('ionicons/package.json'))
  const sourceFiles = await glob('dist/svg/*.svg', {cwd: baseDir, absolute: true})

  return sourceFiles
    .map(filename => {
      const match = filename.match(/([^\/]+)(?<!outline|sharp)\.svg$/)
      if (match === null) {
        return
      }
      return {
        originalName: match[1],
        source: fs.readFileSync(filename).toString(),
        pack: 'ionicons-solid',
        width: '20',
        height: '20',
      }
    })
    .filter(icon => typeof icon !== 'undefined')
}
