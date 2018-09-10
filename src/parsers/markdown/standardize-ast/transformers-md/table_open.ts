import AbsoluteFilePath from "../../../../domain-model/absolute-file-path"
import AstNode from "../../../ast-node"
import AstNodeList from "../../../ast-node-list"
import OpenTagTracker from "../../helpers/open-tag-tracker"

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const resultNode = new AstNode({
    type: node.type,
    tag: "table",
    file,
    line,
    content: "",
    attributes: {}
  })
  openTags.add(resultNode)
  result.pushNode(resultNode)
  return result
}
