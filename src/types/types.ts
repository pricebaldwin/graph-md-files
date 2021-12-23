import matter from 'gray-matter'

export type GraphLinkDirection = 'in' | 'out'
export type GraphNodeType = 'post' | 'note'
export type NonexistantLinkMode = 'Link' | 'Ignore'
export type ObsidianLinkModes =
  | 'Closest Path'
  | 'Absolute Path'
  | 'Relative Path'

export interface GraphNode {
  exists: boolean
  filePath: string
  isEmpty: boolean
  title: string
  content?: string
  hash?: string
  type?: GraphNodeType
  links: { [key: string]: GraphLink }
}

export interface GraphLink {
  direction: GraphLinkDirection
  alias?: string
}

export interface MarkdownGraph {
  rootDir: string
  nodes: { [key: string]: GraphNode }
}

export interface FrontmatterContent extends matter.GrayMatterFile<string> {
  isEmpty: boolean
}

export interface GraphOptions {
  mode: ObsidianLinkModes
  caseSensitivity: boolean
  nonexistantLinkMode: NonexistantLinkMode
}
