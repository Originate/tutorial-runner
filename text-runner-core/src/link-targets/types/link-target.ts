import { LinkTargetTypes } from "./link-target-types"

/**
 * LinkTarget is a position in a Markdown file that links can point to:
 * headers or anchors
 */
export interface LinkTarget {
  type: LinkTargetTypes
  name: string
  text?: string
  level?: number
}