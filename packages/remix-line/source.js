const glob = require('tiny-glob')
const fs = require('fs')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('remixicon/package.json'))
  const sourceFiles = await glob('icons/*/*-line.svg', {cwd: baseDir, absolute: true})

  return sourceFiles
    .map((filename) => {
      if (filename.includes('icons/Editor/')) return false

      const match = filename.match(/([\w-]*)\-line\.svg$/)
      return {
        originalName: match[1],
        source: fs.readFileSync(filename).toString(),
        pack: 'remix-line',
        width: '24',
        height: '24',
      }
    })
    .filter(Boolean)
}
