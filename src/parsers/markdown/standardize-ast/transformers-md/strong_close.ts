import AbsoluteFilePath from "../../../../domain-model/absolute-file-path"
import AstNodeList from "../../../ast-node-list"
import OpenTagTracker from "../../helpers/open-tag-tracker"

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openNode = openTags.popType("strong_open", file.platformified(), line)
  result.pushNode({
    type: node.type,
    tag: "/strong",
    file,
    line,
    content: "",
    attributes: openNode.attributes
  })
  return result
}
