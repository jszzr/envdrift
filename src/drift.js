const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_EXTENSIONS = new Set([
  ".js",
  ".cjs",
  ".mjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".php",
]);

const DEFAULT_IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".nuxt",
  ".venv",
  "venv",
  "target",
]);

const ENV_PATTERNS = [
  /\bprocess\.env\.([A-Z][A-Z0-9_]*)\b/g,
  /\bprocess\.env\[['"`]([A-Z][A-Z0-9_]*)['"`]\]/g,
  /\bimport\.meta\.env\.([A-Z][A-Z0-9_]*)\b/g,
  /\bos\.environ(?:\.get)?\(\s*['"]([A-Z][A-Z0-9_]*)['"]/g,
  /\bgetenv\(\s*['"]([A-Z][A-Z0-9_]*)['"]/g,
];

function parseCSV(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeExtensions(value) {
  return new Set(
    parseCSV(value).map((ext) => (ext.startsWith(".") ? ext : `.${ext}`))
  );
}

function normalizeDirSet(value) {
  return new Set(parseCSV(value));
}

function parseEnvExample(content) {
  const keys = new Set();
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const clean = line.startsWith("export ") ? line.slice(7).trim() : line;
    const match = clean.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (match) {
      keys.add(match[1]);
    }
  }

  return keys;
}

function scanContentForEnvKeys(content) {
  const keys = new Set();

  for (const pattern of ENV_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      keys.add(match[1]);
    }
    pattern.lastIndex = 0;
  }

  return keys;
}

function collectFiles(rootDir, { includeDirs, ignoreDirs, extensions }) {
  const files = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      const relative = path.relative(rootDir, absolute);

      if (entry.isDirectory()) {
        if (ignoreDirs.has(entry.name)) {
          continue;
        }

        if (
          includeDirs.size > 0 &&
          !isInIncludedPath(relative, includeDirs) &&
          !isAncestorOfIncludedPath(relative, includeDirs)
        ) {
          continue;
        }

        stack.push(absolute);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (includeDirs.size > 0 && !isInIncludedPath(relative, includeDirs)) {
        continue;
      }

      const ext = path.extname(entry.name);
      if (extensions.has(ext)) {
        files.push(absolute);
      }
    }
  }

  return files;
}

function isInIncludedPath(relativePath, includeDirs) {
  if (!relativePath) {
    return true;
  }
  return [...includeDirs].some(
    (dir) => relativePath === dir || relativePath.startsWith(`${dir}${path.sep}`)
  );
}

function isAncestorOfIncludedPath(relativePath, includeDirs) {
  if (!relativePath) {
    return true;
  }
  return [...includeDirs].some((dir) => dir.startsWith(`${relativePath}${path.sep}`));
}

function analyzeDrift(rootDir, options = {}) {
  const absoluteRoot = path.resolve(rootDir);
  const exampleFile = options.exampleFile || ".env.example";
  const examplePath = path.resolve(absoluteRoot, exampleFile);

  if (!fs.existsSync(examplePath)) {
    throw new Error(`Example env file not found: ${examplePath}`);
  }

  const extensions =
    options.extensions instanceof Set
      ? options.extensions
      : options.extensions
      ? normalizeExtensions(options.extensions)
      : DEFAULT_EXTENSIONS;

  const ignoreDirs =
    options.ignoreDirs instanceof Set
      ? options.ignoreDirs
      : options.ignoreDirs
      ? normalizeDirSet(options.ignoreDirs)
      : DEFAULT_IGNORE_DIRS;

  const includeDirs =
    options.includeDirs instanceof Set
      ? options.includeDirs
      : options.includeDirs
      ? normalizeDirSet(options.includeDirs)
      : new Set();

  const documented = parseEnvExample(fs.readFileSync(examplePath, "utf8"));
  const files = collectFiles(absoluteRoot, { includeDirs, ignoreDirs, extensions });

  const used = new Set();
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    for (const key of scanContentForEnvKeys(content)) {
      used.add(key);
    }
  }

  const missing = [...used].filter((key) => !documented.has(key)).sort();
  const unused = [...documented].filter((key) => !used.has(key)).sort();

  return {
    root: absoluteRoot,
    examplePath,
    filesScanned: files.length,
    usedKeys: [...used].sort(),
    documentedKeys: [...documented].sort(),
    missingKeys: missing,
    unusedKeys: unused,
  };
}

module.exports = {
  analyzeDrift,
  DEFAULT_EXTENSIONS,
  DEFAULT_IGNORE_DIRS,
  normalizeDirSet,
  normalizeExtensions,
  parseEnvExample,
  parseCSV,
  scanContentForEnvKeys,
  isAncestorOfIncludedPath,
};
