import { expect } from 'chai'
import fs from 'fs'
import loadConfiguration from './load-configuration.js'
import path from 'path'
import tmp from 'tmp'
import { beforeEach, describe, context, it } from 'mocha'

describe('loadConfiguration', function() {
  it('returns default values if no config file is given', function() {
    const result = loadConfiguration('', { command: '' })
    expect(result.fileGlob).to.equal('**/*.md')
  })

  context('config file given', function() {
    beforeEach(function() {
      this.configDir = tmp.dirSync()
      this.configFilePath = path.join(this.configDir.name, 'text-run.yml')
      fs.writeFileSync(this.configFilePath, "files: '*.md'")
      const result = loadConfiguration('', { command: '' })
      expect(result.fileGlob).to.equal('*.md')
    })
  })
})
