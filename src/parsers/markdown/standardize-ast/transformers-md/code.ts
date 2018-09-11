import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"
import AstNodeList from "../../../ast-node-list.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  result.pushNode({
    type: "code_open",
    tag: "code",
    file,
    line,
    content: "",
    attributes: {}
  })
  result.pushNode({
    type: "text",
    tag: "",
    file,
    line,
    content: node.content,
    attributes: {}
  })
  result.pushNode({
    type: "code_close",
    tag: "/code",
    file,
    line,
    content: "",
    attributes: {}
  })
  pretendToUse(openTags)
  return result
}
