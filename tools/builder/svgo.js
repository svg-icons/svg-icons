// @ts-check

const svgo = require('svgo')

const currentColor = process.env.CURRENT_COLOR

const svgoOptions = {
  plugins: [
    'cleanupAttrs',
    'inlineStyles',
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeXMLNS',
    'removeScriptElement',
    'removeTitle',
    'removeDesc',
    'removeUselessDefs',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeHiddenElems',
    'removeEmptyText',
    'removeEmptyContainers',
    // 'removeViewBox',
    'cleanupEnableBackground',
    'minifyStyles',
    'convertStyleToAttrs',
    ...(currentColor ? [{name: 'convertColors', params: {currentColor}}] : []),
    'convertPathData',
    'convertTransform',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeUnusedNS',
    'cleanupIDs',
    'cleanupNumericValues',
    'moveElemsAttrsToGroup',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'mergePaths',
    // 'convertShapeToPath',
    'convertEllipseToCircle',
    'sortDefsChildren',
    'removeStyleElement',
    'removeDimensions',
    {name: 'addAttributesToSVGElement', params: {attributes: [{fill: 'currentColor'}]}},
    {name: 'removeAttrs', params: {attrs: ['id', 'class', '*:(stroke|fill):((?!^none$)(?!^currentColor$).)*']}},
    'sortAttrs',
  ],
}

/**
 * Optimize SVG with svgo
 * @param {string} source icon source
 */
function optimize(source) {
  // @ts-expect-error - fix until @types/svgo updates to 2.0
  return svgo.optimize(source, svgoOptions)
}

module.exports = {optimize}
