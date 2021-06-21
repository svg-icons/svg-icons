const glob = require('tiny-glob')
const fs = require('fs')
const path = require('path')

module.exports = async () => {
  const baseDir = path.dirname(require.resolve('@fluentui/svg-icons/package.json'))
  const sourceFiles = await glob('icons/*_filled.svg', {cwd: baseDir, absolute: true})

  let icons = sourceFiles.map((filename) => {
    const match = filename.match(/([^\/]+)_(\d+)_filled\.svg$/)
    return {
      originalName: match[1].replace(/_/g, '-'),
      source: fs.readFileSync(filename).toString(),
      pack: 'fluentui-system-filled',
      width: match[2],
      height: match[2],
    }
  })

  // Omit 16px textbox icon that incorrectly has a space in its name
  icons = icons.filter((icon) => icon.originalName !== 'text-box' || icon.width !== '16')

  for (const icon of icons) {
    const width = parseInt(icon.width, 10)
    icons = icons.filter((otherIcon) => {
      if (icon.originalName !== otherIcon.originalName) return true
      const otherWidth = parseInt(otherIcon.width, 10)
      return otherWidth >= width
    })
  }

  return icons
}
