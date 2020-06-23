#!/usr/bin/env node
// @ts-check

const fs = require('fs-extra')
const path = require('path')
const svgo = require('./svgo')

const baseDir = process.cwd()

const generate = async () => {
  const icons = await require(path.join(baseDir, 'source.js'))()

  if (icons.length === 0) {
    console.log('Error reading icons from pack')
    process.exit(1)
  }

  const totalIcons = icons.length

  const iconFiles = icons.map(async (icon) => {
    const optimizedSource = await svgo.optimize(icon.source)
    await fs.writeFile(`${icon.originalName}.svg`, optimizedSource.data)
  })

  await Promise.all(iconFiles)

  await fs.writeFile(
    'icons.stories.js',
    `
import {storiesOf} from '@storybook/html'

storiesOf('${path.basename(baseDir)}')
  .add('icons', () => [
${icons.map((icon) => `    require('!!raw-loader!./${icon.originalName}.svg').default,`).join('\n')}
  ].map(icon => \`<div class="icon">\${icon}</div>\`).join('\\n'))

`.trim(),
  )

  console.log(`${totalIcons} icons successfully built!`)
}

generate().catch((err) => {
  console.log(err.stack)
  process.exit(1)
})
