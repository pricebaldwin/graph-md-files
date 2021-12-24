import * as glob from 'glob'
import * as path from 'path'
import { Node } from 'unist'

export function getFilesInDirectory(directoryPath: string): string[] {
  const p = path.join(directoryPath, '/**/*.md')
  return glob.sync(p)
}

interface AST extends Node {
  children?: Node[]
}

// Structure taken from https://github.com/tchayen/markdown-links/blob/50dd76bde7b004b3cae162346f1da0f5b52f7753/src/utils.ts#L6
export const findLinks = (ast: AST): string[] => {
  if (ast.type === 'wikiLink') {
    return [ast.data!.alias as string]
  }

  const links: string[] = []

  if (!ast.children) {
    return links
  }

  for (const node of ast.children) {
    links.push(...findLinks(node))
  }

  return links
}
