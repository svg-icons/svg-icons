const glob = require('tiny-glob')
const fs = require('fs-extra')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('material-design-icons-updated'))
  const sourceFiles = await glob('icons/outline/*/*.svg', {cwd: baseDir, absolute: true})

  const allIcons = sourceFiles.map((filename) => {
    const match = filename.match(/ic_(.*)_(([\d]+)px)\.svg$/)
    return {
      originalName: match[1].replace(/_/g, '-'),
      source: fs.readFileSync(filename).toString(),
      pack: 'material-outlined',
      width: match[4] || '24',
      height: match[4] || '24',
    }
  })

  // Pick highest resolution of icon available
  const icons = new Map()
  for (const icon of allIcons) {
    const existingIcon = icons.get(icon.originalName)
    if (!existingIcon || parseInt(existingIcon.width, 10) < parseInt(icon.width, 10)) {
      icons.set(icon.originalName, icon)
    }
  }

  return [...icons.values()]
}
