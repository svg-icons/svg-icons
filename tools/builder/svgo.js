// @ts-check

const SVGO = require('svgo')

const addKeyPropToChildren = {
  type: 'full',
  fn(node) {
    const firstChild = node.content[0]

    if (!firstChild || !firstChild.content.length) {
      return node
    }

    let keyCount = 0
    firstChild.content = firstChild.content.map((child) => {
      if (child.hasAttr('key')) {
        return
      }

      const value = child.attr('id') || `k${keyCount++}`

      child.addAttr({local: 'key', name: 'key', prefix: '', value})

      return child
    })

    return node
  },
}

const currentColor = process.env.CURRENT_COLOR

const svgoOptions = {
  plugins: [
    {removeXMLNS: true},
    {removeScriptElement: true},
    {removeTitle: true},
    {convertStyleToAttrs: true},
    ...(currentColor ? [{convertColors: {currentColor}}] : []),
    {convertShapeToPath: false},
    {removeStyleElement: true},
    {removeDimensions: true},
    {removeViewBox: false},
    // {addKeyPropToChildren},
    {removeAttrs: {attrs: ['id', '*:(stroke|fill):((?!^none$)(?!^currentColor$).)*']}},
    {sortAttrs: true},
  ],
}

module.exports = new SVGO(svgoOptions)
