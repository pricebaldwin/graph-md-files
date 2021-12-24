import * as crypto from 'crypto'
import * as fs from 'fs'
import * as matter from 'gray-matter'
import * as path from 'path'
import * as markdown from 'remark-parse'
import * as wikiLinkPlugin from 'remark-wiki-link'
import * as unified from 'unified'
import {
  FrontmatterContent,
  GraphNode,
  GraphOptions,
  MarkdownGraph,
} from './types/types'
import {
  findLinks,
  getFilesInDirectory as getMarkdownInDirectory,
} from './utils'

const parser = unified().use(markdown).use(wikiLinkPlugin)

export function makeGraph(
  rootPath: string,
  options: GraphOptions = {
    mode: 'Relative Path',
    caseSensitivity: false,
    nonexistantLinkMode: 'Ignore',
  },
): MarkdownGraph {
  if (!fs.existsSync(rootPath)) {
    throw new Error('Vault path does not exist.')
  }

  const siteGraph: MarkdownGraph = { nodes: {}, rootDir: rootPath }

  // Gets a list of all markdown files in any directories under the root path.
  const allFiles = getMarkdownInDirectory(rootPath)

  // Each file is a node on the graph. No edges, yet, since we need all the things to attach them to first.
  allFiles.forEach((filePath) => {
    // Get the full content of the file, along with any frontmatter data.
    const fileDetails = matter.read(filePath) as FrontmatterContent

    // Add the node to the graph
    // The node is list is an object, to ensure that only one node exists for a given path.
    siteGraph.nodes[filePath] = {
      content: fileDetails.content,
      exists: true,
      filePath: filePath,
      isEmpty: fileDetails.isEmpty,
      title: path.parse(filePath).name,
      hash: crypto.createHash('md5').update(fileDetails.content).digest('hex'),
      links: {},
    } as GraphNode
  })

  /**
   * Finds the closest path within the graph to the given file by name.
   *
   * @param fileName
   */
  function findClosestMatchToFile(fileName: string) {
    // Get any paths that contain the fileName
    const matches = Object.keys(siteGraph.nodes).filter((filePath) => {
      return !!filePath.includes(fileName)
    })

    matches.sort((a, b) => {
      return a.split(path.delimiter).length - b.split(path.delimiter).length
    })

    return matches[0]
  }

  // Now that we have all the nodes, we can find all the links in each node.
  Object.entries(siteGraph.nodes).forEach(([key, value]) => {
    if (value.content) {
      const ast = parser.parse(value.content)
      const links = findLinks(ast)

      // Now we have to get the path for each link in the document.
      links.forEach((l) => {
        // Pipes are used by Obsidian to make an alias
        const parts = l.split('|')

        // If there is a second part, it is the title of the link.
        const linkFileName = path.extname(parts[0])
          ? parts[0]
          : parts[0] + '.md'

        // As of 2021-11-01, Obsidian supports three modes of link creation.
        // However, this only effects _new_ links, so we must be prepared to resolve
        // any of the three types.
        let fullPath
        if (path.isAbsolute(linkFileName)) {
          // If the path is absolute, then we can find it from the root of the vault.
          fullPath = path.join(rootPath, linkFileName)
        } else {
          // Relative path.
          if (linkFileName.startsWith('.')) {
            fullPath = path.join(path.dirname(key), linkFileName)
          } else {
            // Find by closest
            fullPath = findClosestMatchToFile(linkFileName)
          }
        }

        // If the file path was not found, then it must be a non-existant file,
        // because we already scanned all files
        if (!fullPath) {
          console.debug(`Could not find link ${linkFileName}`)
          return
        }

        siteGraph.nodes[key].links[fullPath] = {
          direction: 'out',
          alias: parts[1],
        }
        siteGraph.nodes[fullPath].links[key] = { direction: 'in' }
      })
    } else {
      console.debug('Empty file')
    }
  })

  return siteGraph
}
