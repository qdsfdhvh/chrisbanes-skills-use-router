# chrisbanes-skills-use-router

## Purpose

This project generates a single installable `chrisbanes-skills-use` skill from
the upstream `chrisbanes/skills` collection.

The goal is to avoid installing every upstream Kotlin, Android, and Jetpack
Compose focused skill into the agent. The generated router skill exposes the
upstream skill descriptions in one compact index, then tells the agent to read
only the relevant copied reference doc from
`references/<skill-name>/DOC.md`.

## Layout

- `scripts/generate-chrisbanes-skills-use.js` — generator.
- `scripts/install-local.js` — direct local installer for configured agent
  config roots.
- `scripts/validate-generated-skill.js` — structural validator for generated
  output.
- `templates/chrisbanes-skills-use-skill-template.md` — generated `SKILL.md`
  template.
- `upstream/chrisbanes-skills/` — optional local checkout of
  `https://github.com/chrisbanes/skills.git`, ignored by git.
- `dist/chrisbanes-skills-use/` — generated installable skill, ignored by git.
- `.env` — local direct-install targets, ignored by git.

## Generate Preview

Run from this directory after providing an upstream checkout:

```bash
git clone https://github.com/chrisbanes/skills.git upstream/chrisbanes-skills
node scripts/generate-chrisbanes-skills-use.js
npm run validate
```

If the upstream checkout already exists somewhere else:

```bash
node scripts/generate-chrisbanes-skills-use.js --source /path/to/chrisbanes/skills/skills
npm run validate
```

To generate into a temporary preview directory:

```bash
node scripts/generate-chrisbanes-skills-use.js --source /path/to/chrisbanes/skills/skills --output dist/chrisbanes-skills-use-preview
npm run validate -- dist/chrisbanes-skills-use-preview
```

## Install

Generate first, then install the generated local skill:

```bash
node scripts/generate-chrisbanes-skills-use.js
npx -y skills add ./dist/chrisbanes-skills-use -g -y
```

The `./` prefix is important. Without it, `skills` may interpret
`dist/chrisbanes-skills-use` as a GitHub shorthand.

Check installed skills:

```bash
npx -y skills list -g
```

## Local Direct Install

Copy `.env.example` to `.env` and edit if you want non-default install targets:

```bash
cp .env.example .env
```

`CHRISBANES_SKILLS_USE_INSTALL_TARGETS` is a colon-separated list of agent
config roots. `~` is expanded to the current user's home directory. The
installer copies the generated skill into each root's
`skills/chrisbanes-skills-use` directory.

`.env` is gitignored because it is per-machine configuration.

Run:

```bash
node scripts/generate-chrisbanes-skills-use.js
node scripts/install-local.js
```

## Update Upstream Skills

Use tags for reproducible updates:

```bash
git -C upstream/chrisbanes-skills fetch --tags --prune origin
git -C upstream/chrisbanes-skills tag --sort=-creatordate
git -C upstream/chrisbanes-skills checkout <tag>
node scripts/generate-chrisbanes-skills-use.js
npm run validate
```

Use `main` if you intentionally want the latest unreleased upstream skill docs:

```bash
git -C upstream/chrisbanes-skills fetch --tags --prune origin
git -C upstream/chrisbanes-skills checkout main
git -C upstream/chrisbanes-skills pull --ff-only origin main
node scripts/generate-chrisbanes-skills-use.js
npm run validate
```

Commit generator, template, README, package, and AGENTS changes. Do not commit
`upstream/` or `dist/`.

## Generated Content Rules

- Keep only one installed skill: `chrisbanes-skills-use`.
- Copy upstream skill directories to `references/<skill-name>/`.
- Rename copied upstream `SKILL.md` files to `DOC.md`.
- Strip YAML frontmatter from copied `DOC.md` files.
- Rewrite copied markdown links from `SKILL.md` to `DOC.md`.
- Keep `using-chrisbanes-skills` as a copied reference doc, not as a second
  installed skill.
- Copy the upstream license into generated output as `UPSTREAM-LICENSE`.
- Do not duplicate every upstream frontmatter block in the router `SKILL.md`;
  keep only the compact generated index.
- Treat `dist/` as disposable generated output. Regenerate it rather than
  editing it by hand.
