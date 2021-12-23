This library takes a directory of markdown files and converts them into a graph of nodes. From there, you could use the graph to create:

- Additional tooling for your markdown files.
- A static website.
- Graph visualizations.

## Usage

**This project is in early development, and should not be used for any serious purposes yet!**

This project includes a functional Obsidian vault in `/test vault/`. All tests are run against this directory, and you can look at that for examples of what the graph can do.

### To test out the library:

- Clone this repository.
- Run `yarn install` (you only need to do this once).
- Run `yarn test`

### To test against your own files:

- Change [graph-md-files.test.ts line 11](https://github.com/pricebaldwin/graph-md-files/blob/da6775afc8fb2326efbb21ca6c2d83df95e5b180/src/__tests__/graph-md-files.test.ts#L11) to point to your own directory.
  - (e.g. `const rootDir = /Users/your_name/Documents/your_test_vault_name`)
- Run `yarn test`

## History

I developed this library to help me work with vaults created by [obsidian.md](https://obsidian.md). However, it should work for any folder of markdown files.

## Todo

- [ ] Make support markdown style links.
- [ ] Add links to graph which do not exists as files.
- [ ] Make handling of Obsidian features optional.
