import { AbsoluteFilePath } from "../../../../filesystem/absolute-file-path"
import { AstNodeList } from "../../../standard-AST/ast-node-list"
import { OpenTagTracker } from "../../helpers/open-tag-tracker"
import { loadTransformers } from "../load-transformers"
import { RemarkableNode } from "../types/remarkable-node"
import { TransformerCategory } from "../types/transformer-category"
import { TransformerList } from "../types/transformer-list"

export class CustomMdTransformerCategory implements TransformerCategory {
  private mdTransformers: TransformerList
  private readonly openTags: OpenTagTracker

  constructor(openTags: OpenTagTracker) {
    this.mdTransformers = {}
    this.openTags = openTags
  }

  async loadTransformers() {
    this.mdTransformers = await loadTransformers(__dirname)
  }

  canTransform(node: RemarkableNode): boolean {
    return this.mdTransformers.hasOwnProperty(node.type)
  }

  async transform(
    node: RemarkableNode,
    file: AbsoluteFilePath,
    line: number
  ): Promise<AstNodeList> {
    const transformer = this.mdTransformers[node.type]
    return transformer(node, this.openTags, file, line)
  }
}
