#!/usr/bin/env node
// @ts-check

const glob = require('tiny-glob')
const fs = require('fs-extra')

const ALLOWED_FILES = ['node_modules', 'source.js', 'package.json', 'README.md']

async function run() {
  const files = await glob('*', {filesOnly: true})

  for (const file of files) {
    if (ALLOWED_FILES.includes(file)) {
      continue
    }

    console.log(`Removing ${file}`)
    await fs.remove(file)
  }

  console.log('Done')
}

run().catch((err) => {
  console.log(err.stack)
  process.exit(1)
})
