import * as path from 'path'
import makeGraph from '../index'

// The number of files in the test vault
const NUM_TEST_FILES = 10

it('throws an error if the vault path does not exist', () => {
  expect(() => makeGraph('./thispathshouldnotexist')).toThrowError()
})

describe('graph with default options', () => {
  const rootDir = path.join(__dirname, '../../test vault')
  let graph = makeGraph(rootDir)

  it('has the expected number of nodes', () => {
    console.log(graph)
    expect(Object.keys(graph.nodes).length).toBe(NUM_TEST_FILES)
  })

  it('holds nodes by the expected path', () => {
    const p = path.join(
      rootDir,
      "/books/The Hitchiker's Guide to the Galaxy is really about post-nationalistic deconstructionalism.md",
    )
    expect(graph.nodes[p]).toBeDefined()
  })

  it('marks outbound and inbound links correctly in wiki format', () => {
    const p = path.join(
      rootDir,
      "/books/The Hitchiker's Guide to the Galaxy is really about post-nationalistic deconstructionalism.md",
    )
    const p2 = path.join(
      rootDir,
      '/notes/Post-nationalistic deconstructionalism.md',
    )

    // We find a link from P out to P2
    expect(graph.nodes[p].links[p2]['direction']).toBe('out')

    // We find a link back in from P2 to P
    expect(graph.nodes[p2].links[p]['direction']).toBe('in')
  })

  it('marks outbound and inbound links correctly when link is absolute', () => {
    const p = path.join(rootDir, 'index.md')
    const p2 = path.join(rootDir, '/posts/Post Index.md')

    // We find a link from P out to P2
    expect(graph.nodes[p].links[p2]['direction']).toBe('out')

    // We find a link back in from P2 to P
    expect(graph.nodes[p2].links[p]['direction']).toBe('in')
  })

  it('marks outbound and inbound links correctly when link contains markdown extension', () => {
    const p = path.join(rootDir, 'index.md')
    const p2 = path.join(rootDir, '/notes/Notes Index.md')

    // We find a link from P out to P2
    expect(graph.nodes[p].links[p2]['direction']).toBe('out')

    // We find a link back in from P2 to P
    expect(graph.nodes[p2].links[p]['direction']).toBe('in')
  })

  it('finds files in subdirectories', () => {
    const p = path.join(rootDir, '/notes/Notes Index.md')
    const p2 = path.join(rootDir, '/notes/sub notes/a note two levels in.md')

    // We find a link from P out to P2
    expect(graph.nodes[p].links[p2]['direction']).toBe('out')

    // We find a link back in from P2 to P
    expect(graph.nodes[p2].links[p]['direction']).toBe('in')
  })

  it('excludes links to files which do not exist', () => {
    const p = path.join(rootDir, '/posts/Post Index.md')
    console.log(graph.nodes[p].links)

    expect(
      Object.keys(graph.nodes[p].links).some((key) =>
        key.includes('/posts/An ode to camels.md'),
      ),
    ).toBeFalsy()
  })

  it('gives links an alias, if they have one', () => {
    const p = path.join(rootDir, '/posts/Post Index.md')
    const p2 = path.join(rootDir, '/notes/Notes Index.md')
    expect(graph.nodes[p].links[p2].alias).toBe('Notes')
  })

  it('finds the closest path to the file if one is not provided', () => {
    const p = path.join(rootDir, '/index.md')
    const p2 = path.join(rootDir, '/notes/proximity test.md')
    const p3 = path.join(rootDir, '/notes/sub notes/proximity test.md')

    // We find a link from P out to P2
    expect(graph.nodes[p].links[p2]['direction']).toBe('out')

    // We find a link back in from P2 to P
    expect(graph.nodes[p2].links[p]['direction']).toBe('in')

    // We do not find a link deeper, in p3
    expect(graph.nodes[p].links[p3]).toBeUndefined()
  })
})

describe('Runtime tests', () => {
  const rootDir = path.join(__dirname, '../../test vault')

  it('throws a warning if a file cannot be found by proximity', () => {
    const consoleSpy = jest.spyOn(global.console, 'debug')
    makeGraph(rootDir)

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Could not find link'),
    )
  })

  it('does not try to process empty files', () => {
    const consoleSpy = jest.spyOn(global.console, 'debug')

    let graph = makeGraph(rootDir)

    const p = path.join(rootDir, '/index.md')
    const p2 = path.join(rootDir, '/notes/empty.md')

    console.log(graph.nodes[p].links)

    expect(graph.nodes[p].links[p2]['direction']).toBe('out')
    expect(consoleSpy).toHaveBeenCalledWith('Empty file')
  })

  it('retrieves frontmatter as data', () => {
    const p = path.join(rootDir, '/index.md')
    let graph = makeGraph(rootDir)

    const ourNode = graph.nodes[p]

    expect(ourNode.frontmatter).toEqual({
      date: new Date('2022-05-12T00:00:00.000Z'),
      slug: 'test-vault-index',
      aliases: ['this', 'is', 'an', 'array'],
    })
  })

  it('does not include non-existant files by default', () => {
    const p = path.join(rootDir, '/index.md')
    let graph = makeGraph(rootDir)

    const ourNode = graph.nodes[p]

    expect(
      ourNode.links['notes/a file which definitely does not exist.md'],
    ).not.toBeDefined()
  })
})

describe('graph with non-standard options', () => {
  const rootDir = path.join(__dirname, '../../test vault')

  it('adds non-existant files as links when NonexistantLinkMode === "Link"', () => {
    const p = path.join(rootDir, '/index.md')
    let graph = makeGraph(rootDir, { nonexistantLinkMode: 'Link' })

    const ourNode = graph.nodes[p]

    expect(
      ourNode.links['notes/a file which definitely does not exist.md'],
    ).toBeDefined()
  })
})
