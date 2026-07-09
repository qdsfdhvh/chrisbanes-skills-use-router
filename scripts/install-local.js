#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const skillName = "chrisbanes-skills-use";

function expandHome(p) {
  if (p === "~") {
    return os.homedir();
  }
  if (p.startsWith("~/")) {
    return path.join(os.homedir(), p.slice(2));
  }
  return p;
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const env = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function resolveFromRoot(p) {
  const expanded = expandHome(p);
  return path.isAbsolute(expanded) ? expanded : path.join(repoRoot, expanded);
}

function parseTargets(raw) {
  return raw
    .split(":")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(expandHome);
}

function installToTarget(distDir, targetRoot) {
  const skillsDir = path.basename(targetRoot) === "skills" ? targetRoot : path.join(targetRoot, "skills");
  const destDir = path.join(skillsDir, skillName);

  if (!fs.existsSync(distDir)) {
    throw new Error(`Generated skill does not exist: ${distDir}`);
  }
  fs.mkdirSync(skillsDir, { recursive: true });
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.cpSync(distDir, destDir, { recursive: true });
  return destDir;
}

function main() {
  const dotEnv = loadDotEnv(path.join(repoRoot, ".env"));
  const rawTargets =
    process.env.CHRISBANES_SKILLS_USE_INSTALL_TARGETS ||
    dotEnv.CHRISBANES_SKILLS_USE_INSTALL_TARGETS ||
    "";
  const distDir = resolveFromRoot(
    process.env.CHRISBANES_SKILLS_USE_DIST_DIR ||
      dotEnv.CHRISBANES_SKILLS_USE_DIST_DIR ||
      "dist/chrisbanes-skills-use",
  );
  const targets = parseTargets(rawTargets);

  if (targets.length === 0) {
    throw new Error(
      "No install targets configured. Copy .env.example to .env and set CHRISBANES_SKILLS_USE_INSTALL_TARGETS.",
    );
  }

  for (const target of targets) {
    const dest = installToTarget(distDir, target);
    console.log(`Installed ${skillName} -> ${dest}`);
  }
}

try {
  main();
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(1);
}
