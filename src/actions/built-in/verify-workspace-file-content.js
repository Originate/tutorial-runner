// @flow

const {bold, cyan, red} = require('chalk')
const fs = require('fs')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

module.exports = function (activity: Activity) {
  const filePath = activity.searcher.tagContent(['strongtext', 'emphasizedtext'])
  const expectedContent = activity.searcher.tagContent(['fence', 'code'])
  activity.formatter.action(`verifying file ${cyan(filePath)}`)
  const fullPath = path.join(activity.configuration.testDir, filePath)
  var actualContent
  try {
    actualContent = fs.readFileSync(fullPath, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`file ${red(filePath)} not found`)
    } else {
      throw err
    }
  }
  try {
    jsdiffConsole(actualContent.trim(), expectedContent.trim())
  } catch (err) {
    throw new Error(`mismatching content in ${cyan(bold(filePath))}:\n${err.message}`)
  }
}
