// @ts-check

const SVGO = require('svgo')

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
    {addAttributesToSVGElement: {attributes: [{fill: 'currentColor'}]}},
    {removeAttrs: {attrs: ['id', 'class', '*:(stroke|fill):((?!^none$)(?!^currentColor$).)*']}},
    {sortAttrs: true},
  ],
}

module.exports = new SVGO(svgoOptions)
