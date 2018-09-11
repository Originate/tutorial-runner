import AbsoluteFilePath from "../../../../domain-model/absolute-file-path.js"
import UnprintedUserError from "../../../../errors/unprinted-user-error.js"
import pretendToUse from "../../../../helpers/pretend-to-use.js"
import AstNodeList from "../../../ast-node-list.js"
import AstNode from "../../../ast-node.js"
import OpenTagTracker from "../../helpers/open-tag-tracker.js"
import parseHtmlAttributes from "../../helpers/parse-html-attributes.js"

const preRegex = /<pre([^>]*)>([\s\S]*)<\/pre>/m

module.exports = async function transformPre(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(preRegex)
  if (!match) {
    throw new UnprintedUserError(
      "cannot match <pre> tag",
      file.platformified(),
      line
    )
  }
  const resultNode = new AstNode({
    attributes: parseHtmlAttributes(match[1]),
    content: match[2],
    file,
    line,
    tag: "pre",
    type: "fence"
  })
  result.pushNode(resultNode)
  pretendToUse(openTags)
  return result
}
