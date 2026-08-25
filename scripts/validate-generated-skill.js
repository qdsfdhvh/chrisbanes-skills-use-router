#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const skillName = "chrisbanes-skills-use";
const defaultSkillDir = path.join(repoRoot, "skills", skillName);

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function readText(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing file: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    fail("SKILL.md is missing YAML frontmatter");
  }
  return match[1];
}

function readScalar(frontmatter, key) {
  const lines = frontmatter.split(/\r?\n/);
  const prefix = `${key}:`;
  for (const line of lines) {
    if (!line.startsWith(prefix)) {
      continue;
    }
    const raw = line.slice(prefix.length).trim();
    if (raw.length >= 2) {
      const quote = raw[0];
      if ((quote === "\"" || quote === "'") && raw[raw.length - 1] === quote) {
        return raw.slice(1, -1);
      }
    }
    return raw;
  }
  return "";
}

function listMarkdownFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function validate(skillDir) {
  const skillMd = readText(path.join(skillDir, "SKILL.md"));
  const frontmatter = extractFrontmatter(skillMd);
  const name = readScalar(frontmatter, "name");
  const description = readScalar(frontmatter, "description");

  if (name !== skillName) {
    fail(`Expected name '${skillName}', found '${name}'`);
  }
  if (!description || description.length > 1024) {
    fail("Description must be present and no longer than 1024 characters");
  }
  if (!skillMd.includes("references/using-chrisbanes-skills/DOC.md")) {
    fail("SKILL.md must route broad tasks through references/using-chrisbanes-skills/DOC.md");
  }

  const refsDir = path.join(skillDir, "references");
  if (!fs.existsSync(refsDir)) {
    fail("Missing references directory");
  }

  const referenceDocs = fs
    .readdirSync(refsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(refsDir, entry.name, "DOC.md"));

  if (referenceDocs.length === 0) {
    fail("No reference DOC.md files generated");
  }
  const usingGuidePath = path.join(refsDir, "using-chrisbanes-skills", "DOC.md");
  if (!fs.existsSync(usingGuidePath)) {
    fail("Missing primary route guide: references/using-chrisbanes-skills/DOC.md");
  }
  for (const docPath of referenceDocs) {
    if (!fs.existsSync(docPath)) {
      fail(`Missing reference doc: ${docPath}`);
    }
  }

  // Upstream skills may ship their own agents/ configs; those must never leak
  // into references/ (the router only reads DOC.md and its sub-docs).
  for (const entry of fs.readdirSync(refsDir, { withFileTypes: true })) {
    if (entry.isDirectory() && fs.existsSync(path.join(refsDir, entry.name, "agents"))) {
      fail(`Unexpected agents/ dir copied from upstream: references/${entry.name}/agents`);
    }
  }

  // Every ../<skill>/DOC.md link in the primary route guide must point at a
  // reference doc that was actually generated (catches dead links when skills
  // are excluded or upstream renames a skill).
  const usingGuide = readText(usingGuidePath);
  const linkPattern = /\(\.\.\/([A-Za-z0-9._-]+)\/DOC\.md\)/g;
  let linkMatch;
  while ((linkMatch = linkPattern.exec(usingGuide)) !== null) {
    const linkedSkill = linkMatch[1];
    if (!fs.existsSync(path.join(refsDir, linkedSkill, "DOC.md"))) {
      fail(`Dead link in using-chrisbanes-skills/DOC.md: ../${linkedSkill}/DOC.md does not exist`);
    }
  }

  for (const filePath of listMarkdownFiles(skillDir)) {
    const content = readText(filePath);
    if (content.includes("SKILL.md")) {
      fail(`Found stale SKILL.md reference in ${path.relative(skillDir, filePath)}`);
    }
  }

  const openAiYaml = readText(path.join(skillDir, "agents", "openai.yaml"));
  if (!openAiYaml.includes(`$${skillName}`)) {
    fail("agents/openai.yaml default prompt must mention the skill name");
  }

  const version = readScalar(frontmatter, "version");
  if (!version || version === "{{VERSION}}") {
    fail("version field must be a concrete version (not an unresolved template placeholder)");
  }

  console.log(`Validated ${path.relative(repoRoot, skillDir)} with ${referenceDocs.length} reference docs (v${version})`);
}

const skillDir = process.argv[2] ? path.resolve(process.argv[2]) : defaultSkillDir;
validate(skillDir);
