---
date: 2022-05-12
slug: test-vault-index
aliases: [this, is, an, array]
---

# Test Index

This http://obsidian.md/ style vault is intended to show all of the functionality that the Obsidian Grapher tool can parse.

- [[Notes Index.md]]
- [[/posts/Post Index]]
- [[proximity test]] <-- This is found by closest match in `notes/proximity test.md`, not the sub-folder `sub-notes`.
- [[notes/empty]] <-- This note is empty, so the processor will add it to the graph, but skip trying to process any content.
- [[notes/a file which definitely does not exist]] <-- This note does not exist, so we mark it as non-existant.
