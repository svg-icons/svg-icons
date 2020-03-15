#!/usr/bin/env node
// @ts-check

const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')

const baseDir = process.cwd()

const generate = async () => {
  const icons = await require(path.join(baseDir, 'source.js'))()

  if (icons.length === 0) {
    console.log('Error reading icons from pack')
    process.exit(1)
  }

  const totalIcons = icons.length

  for (const icon of icons) {
    await fs.writeFile(`${icon.originalName}.svg`, icon.source)
  }

  const iconStories = icons.map(
    icon =>
      `  .add('${icon.originalName}', () => \`<div class="icon">\${require('!!raw-loader!./${icon.originalName}.svg').default}</div>\`)`,
  )

  await fs.writeFile(
    'icons.stories.js',
    `
import {storiesOf} from '@storybook/html'

storiesOf('${path.basename(baseDir)}')
${iconStories.join('\n')}

`.trim(),
  )

  await execa('../../target/debug/svgbuilder', ['.'], {stdio: 'inherit'})

  console.log(`${totalIcons} icons successfully built!`)
}

generate().catch(err => {
  console.log(err.stack)
  process.exit(1)
})
