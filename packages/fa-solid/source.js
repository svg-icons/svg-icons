const fontawesome = require('@fortawesome/fontawesome-svg-core')
const solid = require('@fortawesome/free-solid-svg-icons').fas
const fastCase = require('fast-case')

module.exports = async () =>
  Object.keys(solid).map((iconKey) => {
    const icon = fontawesome.icon(solid[iconKey])
    const originalName = fastCase.decamelize(iconKey).replace('fa_', '').replace(/_/g, '-')
    return {
      originalName: originalName,
      source: icon.html[0],
      pack: 'fa-solid',
      verticalAlign: '-.125em',
    }
  })
