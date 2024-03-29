const glob = require('tiny-glob')
const fs = require('fs')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('remixicon/package.json'))
  const sourceFiles = await glob('icons/*/*-fill.svg', {cwd: baseDir, absolute: true})

  return sourceFiles
    .map((filename) => {
      if (filename.includes('icons/Editor/')) return false

      const match = filename.match(/([\w-]*)\-fill\.svg$/)
      return {
        originalName: match[1],
        source: fs.readFileSync(filename).toString(),
        pack: 'remix-fill',
        width: '24',
        height: '24',
      }
    })
    .filter(Boolean)
}
