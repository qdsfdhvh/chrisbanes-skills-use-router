# chrisbanes-skills-use-router

Generate a single `chrisbanes-skills-use` skill from the upstream
`chrisbanes/skills` Kotlin, Android, and Jetpack Compose skill set.

## Why

`chrisbanes/skills` ships many focused skills. Installing all of them means every
frontmatter description is loaded at session startup, even when the current task
does not touch Kotlin, Android, or Compose.

This router collapses that set into one small entry skill. The generated
`SKILL.md` contains a compact routing index and stores each upstream skill under
`references/<skill-name>/DOC.md`. Codex reads only the relevant copied doc when a
task actually needs it.

Upstream already includes `using-chrisbanes-skills`, which explains how to pick
between the focused skills. This project keeps that doc, but moves it into the
same generated reference layout as the other skills instead of requiring the
original multi-skill repo structure.

## Generate

First provide an upstream checkout:

```bash
git clone https://github.com/chrisbanes/skills.git upstream/chrisbanes-skills
```

Then generate the router skill:

```bash
node scripts/generate-chrisbanes-skills-use.js
npm run validate
```

You can also point at any local checkout:

```bash
node scripts/generate-chrisbanes-skills-use.js --source /path/to/chrisbanes/skills/skills
```

Output:

```text
dist/chrisbanes-skills-use/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    └── <skill-name>/DOC.md
```

## Install

```bash
npx -y skills add ./dist/chrisbanes-skills-use -g -y
```

Use the leading `./`; otherwise `skills` may treat the path as a GitHub
shorthand.

For local direct install, copy `.env.example` to `.env`, edit the target list if
needed, then run:

```bash
node scripts/generate-chrisbanes-skills-use.js
node scripts/install-local.js
```

## Update Upstream

```bash
git -C upstream/chrisbanes-skills fetch --tags --prune origin
git -C upstream/chrisbanes-skills checkout <tag-or-branch>
node scripts/generate-chrisbanes-skills-use.js
```
