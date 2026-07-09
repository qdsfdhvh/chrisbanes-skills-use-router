#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const skillName = "chrisbanes-skills-use";

const defaults = {
  source: "upstream/chrisbanes-skills/skills",
  output: "dist/chrisbanes-skills-use",
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

function listSkillDirs(sourceDir) {
  return fs
    .readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(sourceDir, entry.name))
    .filter((dir) => fs.existsSync(path.join(dir, "SKILL.md")))
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
}

function extractFrontmatter(skillPath) {
  const content = fs.readFileSync(skillPath, "utf8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    throw new Error(`Missing YAML frontmatter: ${skillPath}`);
  }
  return match[1].trimEnd();
}

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

function stripYamlQuotes(value) {
  if (value.length >= 2) {
    const quote = value[0];
    if ((quote === "\"" || quote === "'") && value[value.length - 1] === quote) {
      return value.slice(1, -1);
    }
  }
  return value;
}

function readScalar(frontmatter, key) {
  const lines = frontmatter.split(/\r?\n/);
  const prefix = `${key}:`;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.startsWith(prefix)) {
      continue;
    }
    const raw = line.slice(prefix.length).trim();
    if (raw === "|" || raw === ">") {
      const block = [];
      for (let j = i + 1; j < lines.length; j += 1) {
        const next = lines[j];
        if (!next.startsWith(" ") && !next.startsWith("\t")) {
          break;
        }
        block.push(next.trim());
      }
      return block.join(raw === ">" ? " " : "\n").trim();
    }
    return stripYamlQuotes(raw);
  }
  return "";
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

function categoryForSkill(name) {
  if (name === "using-chrisbanes-skills") return "Routing";
  if (name.startsWith("compose-")) return "Jetpack Compose";
  if (name.startsWith("kotlin-")) return "Kotlin";
  if (name === "shepherd") return "Workflow";
  return "Other";
}

function escapeTableCell(value) {
  return value.replace(/\r?\n/g, " ").replace(/\|/g, "\\|").trim();
}

function renderSkillIndex(skills) {
  const rows = [
    "| Category | Skill | Reference doc | Description |",
    "| --- | --- | --- | --- |",
  ];
  for (const skill of skills) {
    rows.push(
      `| ${skill.category} | \`${skill.name}\` | \`${skill.docPath}\` | ${escapeTableCell(skill.description)} |`,
    );
  }
  return rows.join("\n");
}

function writeOpenAiYaml(outputDir) {
  const agentsDir = path.join(outputDir, "agents");
  fs.mkdirSync(agentsDir, { recursive: true });
  const content = `interface:
  display_name: "Chrisbanes Skills Use"
  short_description: "Route Kotlin and Compose skill docs"
  default_prompt: "Use $${skillName} to choose the right Kotlin, Android, or Jetpack Compose skill guidance."
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
  const skills = skillDirs.map((dir) => {
    const skillPath = path.join(dir, "SKILL.md");
    const frontmatter = extractFrontmatter(skillPath);
    const name = readScalar(frontmatter, "name") || path.basename(dir);
    const description = readScalar(frontmatter, "description");
    const docPath = path.posix.join("references", path.basename(dir), "DOC.md");
    return {
      category: categoryForSkill(name),
      description,
      dir,
      docPath,
      name,
    };
  });

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const referencesDir = path.join(outputDir, "references");
  for (const skill of skills) {
    copyDir(skill.dir, path.join(referencesDir, path.basename(skill.dir)));
  }

  const template = fs.readFileSync(templatePath, "utf8");
  const generated = template.replaceAll("{{SKILL_INDEX}}", renderSkillIndex(skills));

  fs.writeFileSync(path.join(outputDir, "SKILL.md"), generated);
  writeOpenAiYaml(outputDir);
  copyUpstreamLicense(sourceDir, outputDir);

  console.log(`Generated ${skills.length} skills into ${path.relative(repoRoot, outputDir)}`);
  console.log(`Router skill: ${path.relative(repoRoot, path.join(outputDir, "SKILL.md"))}`);
  console.log(`Reference docs: ${path.relative(repoRoot, referencesDir)}`);
}

try {
  main();
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(1);
}
