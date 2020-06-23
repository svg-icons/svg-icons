const glob = require('tiny-glob')
const fs = require('fs-extra')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('material-design-icons-updated'))
  const sourceFiles = await glob('icons/filled/*/*24px.svg', {cwd: baseDir, absolute: true})

  return sourceFiles.map((filename) => {
    const match = filename.match(/ic_(.*)_(((\d+)x)?[\d]+px)\.svg$/)
    return {
      originalName: match[1].replace(/_/g, '-'),
      source: fs.readFileSync(filename).toString(),
      pack: 'material-filled',
      width: match[4] || '24',
      height: '24',
    }
  })
}
