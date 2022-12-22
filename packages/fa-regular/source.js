const fontawesome = require('@fortawesome/fontawesome-svg-core')
const regular = require('@fortawesome/free-regular-svg-icons').far
const fastCase = require('fast-case')

module.exports = async () =>
  Object.keys(regular).map((iconKey) => {
    const icon = fontawesome.icon(regular[iconKey])
    const originalName = fastCase.decamelize(iconKey).replace('fa_', '').replace(/_/g, '-')
    return {
      originalName: originalName,
      source: icon.html[0],
      pack: 'fa-regular',
      verticalAlign: '-.125em',
    }
  })
