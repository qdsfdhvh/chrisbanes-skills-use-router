#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const skillName = "chrisbanes-skills-use";

// Upstream skills excluded from the generated router. These are GitHub Project
// workflow skills (autonomous backlog draining / planning / PR shepherding) that
// are irrelevant to regular Kotlin, Android, and Jetpack Compose development and
// account for most of the generated size. Excluded skills are not copied into
// references/, and any routing-table rows in using-chrisbanes-skills that link
// to them are stripped to avoid dead links.
const EXCLUDED_SKILLS = ["run-github-project", "shepherd", "to-plan"];

// Upstream skills may ship their own agents/openai.yaml (and the router itself
// generates one at the skill root). Those per-skill agent configs are dead
// weight inside references/: the router only reads DOC.md and its sub-docs, so
// copying them just inflates the generated skill. Skip the agents/ directory
// while copying each upstream skill.
const SKIP_DIRS = ["agents"];

const defaults = {
  source: "upstream/chrisbanes-skills/skills",
  output: "skills/chrisbanes-skills-use",
  template: "templates/chrisbanes-skills-use-skill-template.md",
};

function usage() {
  return `Usage: node scripts/generate-chrisbanes-skills-use.js [options]

Options:
  --source <dir>     Source chrisbanes/skills skill directory (default: ${defaults.source})
  --output <dir>     Generated router skill directory (default: ${defaults.output})
  --template <file>  Router SKILL.md template (default: ${defaults.template})
  --help             Show this help

The generated skill contains:
  SKILL.md
  agents/openai.yaml
  references/<skill-name>/DOC.md
  references/<skill-name>/...
`;
}

function readUpstreamVersion(sourceDir) {
  const upstreamRoot = path.dirname(sourceDir);
  try {
    return execSync("git describe --tags --abbrev=0", { cwd: upstreamRoot, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function parseArgs(argv) {
  const opts = { ...defaults };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (!["--source", "--output", "--template"].includes(arg)) {
      throw new Error(`Unknown option: ${arg}`);
    }
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`);
    }
    opts[arg.slice(2)] = value;
    i += 1;
  }
  return opts;
}

function resolveFromRoot(p) {
  return path.isAbsolute(p) ? p : path.join(repoRoot, p);
}

function stripExcludedSkillLinks(guidePath) {
  if (!fs.existsSync(guidePath) || EXCLUDED_SKILLS.length === 0) {
    return;
  }
  const patterns = EXCLUDED_SKILLS.map((name) => `../${name}/DOC.md`);
  const lines = fs.readFileSync(guidePath, "utf8").split(/\r?\n/);
  const kept = lines.filter((line) => !patterns.some((pattern) => line.includes(pattern)));
  if (kept.length !== lines.length) {
    fs.writeFileSync(guidePath, kept.join("\n"));
    console.log(`Stripped ${lines.length - kept.length} link(s) to excluded skills from ${path.relative(repoRoot, guidePath)}`);
  }
}

function listSkillDirs(sourceDir) {
  return fs
    .readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(sourceDir, entry.name))
    .filter((dir) => fs.existsSync(path.join(dir, "SKILL.md")))
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
}

function stripFrontmatter(content) {
  const lines = content.split("\n");
  if (lines[0]?.trim() !== "---") {
    return content;
  }
  const end = lines.indexOf("---", 1);
  if (end === -1) {
    return content;
  }
  return lines.slice(end + 1).join("\n");
}

function transformMarkdownContent(content, stripHead) {
  const body = stripHead ? stripFrontmatter(content) : content;
  return body.replaceAll("SKILL.md", "DOC.md");
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") {
      continue;
    }
    if (entry.isDirectory() && SKIP_DIRS.includes(entry.name)) {
      continue;
    }
    const srcPath = path.join(src, entry.name);
    const destName = entry.name === "SKILL.md" ? "DOC.md" : entry.name;
    const destPath = path.join(dest, destName);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      if (entry.name.endsWith(".md")) {
        const content = fs.readFileSync(srcPath, "utf8");
        fs.writeFileSync(destPath, transformMarkdownContent(content, entry.name === "SKILL.md"));
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    } else if (entry.isSymbolicLink()) {
      fs.symlinkSync(fs.readlinkSync(srcPath), destPath);
    }
  }
}


function writeOpenAiYaml(outputDir) {
  const agentsDir = path.join(outputDir, "agents");
  fs.mkdirSync(agentsDir, { recursive: true });
  const content = `interface:
  display_name: "Chrisbanes Skills Use"
  short_description: "Route Kotlin and Compose skill docs"
  default_prompt: "Use $${skillName} to read the using-chrisbanes-skills guide and choose the right focused Kotlin, Android, or Jetpack Compose guidance."
`;
  fs.writeFileSync(path.join(agentsDir, "openai.yaml"), content);
}

function copyUpstreamLicense(sourceDir, outputDir) {
  const upstreamRoot = path.dirname(sourceDir);
  const licensePath = path.join(upstreamRoot, "LICENSE");
  if (fs.existsSync(licensePath)) {
    fs.copyFileSync(licensePath, path.join(outputDir, "UPSTREAM-LICENSE"));
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const sourceDir = resolveFromRoot(opts.source);
  const outputDir = resolveFromRoot(opts.output);
  const templatePath = resolveFromRoot(opts.template);

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source directory does not exist: ${sourceDir}`);
  }
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template does not exist: ${templatePath}`);
  }

  const skillDirs = listSkillDirs(sourceDir);
  const includedDirs = skillDirs.filter((dir) => !EXCLUDED_SKILLS.includes(path.basename(dir)));
  const excluded = skillDirs.filter((dir) => EXCLUDED_SKILLS.includes(path.basename(dir)));

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const referencesDir = path.join(outputDir, "references");
  for (const dir of includedDirs) {
    copyDir(dir, path.join(referencesDir, path.basename(dir)));
  }

  // Remove routing-table rows in the primary guide that link to excluded
  // skills, so the router never points at a missing reference doc.
  stripExcludedSkillLinks(path.join(referencesDir, "using-chrisbanes-skills", "DOC.md"));

  const upstreamVersion = readUpstreamVersion(sourceDir);
  const template = fs.readFileSync(templatePath, "utf8");
  const generated = template.replaceAll("{{VERSION}}", upstreamVersion);

  fs.writeFileSync(path.join(outputDir, "SKILL.md"), generated);
  writeOpenAiYaml(outputDir);
  copyUpstreamLicense(sourceDir, outputDir);

  console.log(`Generated ${includedDirs.length} skills (upstream ${upstreamVersion}) into ${path.relative(repoRoot, outputDir)}`);
  if (excluded.length > 0) {
    console.log(`Excluded ${excluded.map((dir) => path.basename(dir)).join(", ")} (not copied to references/)`);
  }
  console.log(`Router skill: ${path.relative(repoRoot, path.join(outputDir, "SKILL.md"))}`);
  console.log(`Reference docs: ${path.relative(repoRoot, referencesDir)}`);
}

try {
  main();
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(1);
}
