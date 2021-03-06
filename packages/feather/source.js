const feather = require('feather-icons')

module.exports = async () =>
  Object.keys(feather.icons).map((originalName) => {
    const icon = feather.icons[originalName]
    const cleanedName = originalName === 'package' ? 'package-icon' : originalName
    return {
      originalName: cleanedName,
      source: icon.toSvg(),
      pack: 'feather',
      width: icon.attrs.width,
      height: icon.attrs.height,
    }
  })
