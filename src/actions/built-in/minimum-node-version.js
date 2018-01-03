// @flow

const {cyan} = require('chalk')
const fs = require('fs')
const jsYaml = require('js-yaml')
const minimum = require('../../helpers/minimum.js')

module.exports = function (params: Activity) {
  params.formatter.start('determining minimum supported NodeJS version')

  const documentedVersion = parseInt(params.searcher.tagContent('text'))
  if (isNaN(documentedVersion)) throw new Error('given Node version is not a number')
  params.formatter.refine(`determining whether minimum supported NodeJS version is ${cyan(documentedVersion)}`)

  var supportedVersion
  try {
    supportedVersion = getSupportedVersion()
  } catch (err) {
    params.formatter.error(err)
    throw new Error('1')
  }
  if (supportedVersion === documentedVersion) {
    params.formatter.success(`requires at least Node ${cyan(supportedVersion)}`)
    return
  }
  if (supportedVersion !== documentedVersion) {
    params.formatter.error(`documented minimum Node version is ${cyan(documentedVersion)}, should be ${cyan(supportedVersion)}`)
    throw new Error('1')
  }
}

function getSupportedVersion () {
  const content = loadYmlFile('.travis.yml')
  if (!content) throw new Error('.travis.yml is empty')
  const minimumVersion = parseInt(minimum(content.node_js))
  if (isNaN(minimumVersion)) throw new Error('listed version is not a number')
  return minimumVersion
}

function loadYmlFile (filename: string) {
  const fileContent = fs.readFileSync(filename, {encoding: 'utf8'})
  return jsYaml.safeLoad(fileContent)
}
