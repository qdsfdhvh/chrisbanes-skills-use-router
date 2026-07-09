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

`dist/` is generated output and is intentionally not committed. This avoids
checking copied upstream skill docs into this repository; regenerate the router
locally whenever the upstream checkout changes.

Upstream already includes `using-chrisbanes-skills`, which explains how to pick
between the focused skills. This project keeps that doc, but moves it into the
same generated reference layout as the other skills. Broad or unclear tasks are
guided to `references/using-chrisbanes-skills/DOC.md` first, then to the focused
docs it selects.

## Generate

Initialize the upstream submodule:

```bash
git submodule update --init --recursive
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

Generate and install:

```bash
node scripts/generate-chrisbanes-skills-use.js
npm run validate
npx -y skills add ./dist/chrisbanes-skills-use -g -y
```

The installed skill should be named `chrisbanes-skills-use` and have
`SKILL.md` at its root, for example
`.agents/skills/chrisbanes-skills-use/SKILL.md`. Do not import this repository
root as the skill.

## Update Upstream

```bash
git -C upstream/chrisbanes-skills fetch --tags --prune origin
git -C upstream/chrisbanes-skills checkout <tag-or-branch>
node scripts/generate-chrisbanes-skills-use.js
npm run validate
npx -y skills add ./dist/chrisbanes-skills-use -g -y
```

Then commit the submodule pointer change in this repository. Do not commit
`dist/`.
