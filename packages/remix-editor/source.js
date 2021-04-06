const glob = require('tiny-glob')
const fs = require('fs')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('remixicon/package.json'))
  const sourceFiles = await glob('icons/Editor/*.svg', {cwd: baseDir, absolute: true})
  console.log({sourceFiles})

  return sourceFiles.map((filename) => {
    const match = filename.match(/([\w-]*)\.svg$/)
    return {
      originalName: match[1],
      source: fs.readFileSync(filename).toString(),
      pack: 'remix-line',
      width: '24',
      height: '24',
    }
  })
}
