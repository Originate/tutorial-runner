import { AbsoluteFilePath } from '../../../../../domain-model/absolute-file-path'
import { pretendToUse } from '../../../../../helpers/pretend-to-use'
import { AstNodeList } from '../../../../ast-node-list'
import { OpenTagTracker } from '../../../helpers/open-tag-tracker'
import { RemarkableNode } from '../../remarkable-node'

export default function(
  node: RemarkableNode,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  result.pushNode({
    attributes: {
      alt: node.alt,
      src: node.src
    },
    content: '',
    file,
    line,
    tag: 'img',
    type: 'image'
  })
  pretendToUse(openTags)
  return result
}