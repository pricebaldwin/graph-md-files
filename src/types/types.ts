import matter from 'gray-matter'

export type GraphLinkDirection = 'in' | 'out'
export type GraphNodeType = 'post' | 'note'
export type NonexistantLinkMode = 'Link' | 'Ignore'
export type ObsidianLinkModes =
  | 'Closest Path'
  | 'Absolute Path'
  | 'Relative Path'

export interface GraphNode<T = { [key: string]: any }> {
  content?: string
  exists: boolean
  filePath: string
  frontmatter: T
  hash?: string
  isEmpty: boolean
  links: { [key: string]: GraphLink }
  title: string
  type?: GraphNodeType
}

export interface GraphLink {
  direction: GraphLinkDirection
  alias?: string
  nonexistantFile?: boolean
}

export interface MarkdownGraph {
  rootDir: string
  nodes: { [key: string]: GraphNode }
}

export interface FrontmatterContent extends matter.GrayMatterFile<string> {
  isEmpty: boolean
}

export interface GraphOptions {
  mode?: ObsidianLinkModes
  caseSensitivity?: boolean
  nonexistantLinkMode?: NonexistantLinkMode
}
