export * from "./find"
export * from "./list"

/**
 * Target is a position in a Markdown file that links can point to:
 * headers or anchors
 */
export interface Target {
  level?: number
  name: string
  text?: string
  type: Types
}

/** types of link targets */
export type Types = "heading" | "anchor"
