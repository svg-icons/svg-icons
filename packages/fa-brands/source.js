const fontawesome = require('@fortawesome/fontawesome-svg-core')
const brands = require('@fortawesome/free-brands-svg-icons').fab
const fastCase = require('fast-case')

module.exports = async () =>
  Object.keys(brands).map((iconKey) => {
    const icon = fontawesome.icon(brands[iconKey])
    const originalName = fastCase.decamelize(iconKey).replace('fa_', '').replace(/_/g, '-')
    return {
      originalName: originalName,
      source: icon.html[0],
      pack: 'fa-brands',
      verticalAlign: '-.125em',
    }
  })
