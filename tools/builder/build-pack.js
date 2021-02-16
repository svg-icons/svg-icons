#!/usr/bin/env node
// @ts-check

const fs = require('fs-extra')
const path = require('path')
const svgParser = require('svg-parser')
const svgo = require('./svgo')

const baseDir = process.cwd()

function svgMetadata(source) {
  const ast = svgParser.parse(source)
  const svgNode = ast.children.find((node) => node.type === 'element' && node.tagName === 'svg')
  const attrs = svgNode.type === 'element' ? svgNode.properties : {}
  const viewBox = attrs['viewBox'].toString().split(' ')
  const [, , width, height] = viewBox
  return {attrs, width: parseInt(width, 10), height: parseInt(height, 10)}
}

const generate = async () => {
  const icons = await require(path.join(baseDir, 'source.js'))()

  if (icons.length === 0) {
    console.log('Error reading icons from pack')
    process.exit(1)
  }

  icons.sort((a, b) => a.originalName.localeCompare(b.originalName))

  const seenIcons = new Set()
  const uniqueIcons = icons.filter((icon) => {
    if (seenIcons.has(icon.originalName)) {
      console.log(`Warning: ignoring duplicate icon ${icon.originalName}`)
      return false
    }
    seenIcons.add(icon.originalName)
    return true
  })

  const totalIcons = uniqueIcons.length
  const manifest = []

  const iconFiles = uniqueIcons.map(async (icon) => {
    const {data} = await svgo.optimize(icon.source)
    await fs.writeFile(`${icon.originalName}.svg`, data)
    const metadata = {name: icon.originalName, ...svgMetadata(data)}
    manifest.push(metadata)
    await fs.writeJSON(`${icon.originalName}.json`, metadata)
  })

  await Promise.all(iconFiles)

  await fs.writeFile(
    'icons.stories.js',
    `
import {storiesOf} from '@storybook/html'

storiesOf('${path.basename(baseDir)}')
  .add('icons', () => [
${icons
  .map((icon) => `    ['${icon.originalName}', require('!!raw-loader!./${icon.originalName}.svg').default],`)
  .join('\n')}
  ].map(icon => \`<div>\${icon[0]}</div><div class="icon">\${icon[1]}</div>\`).join('\\n'))

`.trim(),
  )

  await fs.writeJSON('__manifest.json', manifest)

  console.log(`${totalIcons} icons successfully built!`)
}

generate().catch((err) => {
  console.log(err.stack)
  process.exit(1)
})
