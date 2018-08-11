// @flow

const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const resultNode = new AstNode({
    type: node.type,
    tag: 'table',
    file,
    line,
    content: '',
    attributes: {}
  })
  openTags.add(resultNode)
  result.pushNode(resultNode)
  return result
}
