#!/usr/bin/env node

const path = require("node:path");
const { analyzeDrift } = require("../src/drift");

function printHelp() {
  console.log(
    [
      "envdrift - detect drift between code env usage and .env.example",
      "",
      "Usage:",
      "  envdrift [root] [options]",
      "",
      "Options:",
      "  --example <file>     Example env file path relative to root (default: .env.example)",
      "  --include <dirs>     Comma-separated directories to scan only (e.g. src,apps/web)",
      "  --exclude <dirs>     Comma-separated directories to ignore",
      "  --ext <exts>         Comma-separated file extensions to scan (e.g. js,ts,py)",
      "  --strict             Exit 1 when unused keys exist (missing already fails by default)",
      "  --json               Print machine-readable JSON output",
      "  -h, --help           Show help",
      "",
      "Exit codes:",
      "  0: no drift (or only unused keys without --strict)",
      "  1: missing keys, or strict mode with unused keys",
      "  2: invalid usage or runtime error",
    ].join("\n")
  );
}

function parseArgs(argv) {
  const args = {
    root: ".",
    strict: false,
    json: false,
    exampleFile: ".env.example",
  };

  let positionalRootSet = false;
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "-h" || token === "--help") {
      args.help = true;
      continue;
    }

    if (token === "--strict") {
      args.strict = true;
      continue;
    }

    if (token === "--json") {
      args.json = true;
      continue;
    }

    if (token === "--example" || token === "--include" || token === "--exclude" || token === "--ext") {
      const value = argv[i + 1];
      if (!value || value.startsWith("-")) {
        throw new Error(`Missing value for ${token}`);
      }
      i += 1;

      if (token === "--example") {
        args.exampleFile = value;
      } else if (token === "--include") {
        args.includeDirs = value;
      } else if (token === "--exclude") {
        args.ignoreDirs = value;
      } else if (token === "--ext") {
        args.extensions = value;
      }
      continue;
    }

    if (token.startsWith("-")) {
      throw new Error(`Unknown option: ${token}`);
    }

    if (positionalRootSet) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    args.root = token;
    positionalRootSet = true;
  }

  return args;
}

function formatResult(result) {
  const lines = [];
  lines.push(`Scanned ${result.filesScanned} files`);
  lines.push(`Example file: ${result.examplePath}`);
  lines.push("");

  if (result.missingKeys.length > 0) {
    lines.push("Missing in .env.example (used in source):");
    for (const key of result.missingKeys) {
      lines.push(`  - ${key}`);
    }
    lines.push("");
  } else {
    lines.push("No missing keys in .env.example.");
    lines.push("");
  }

  if (result.unusedKeys.length > 0) {
    lines.push("Unused in .env.example (not found in source):");
    for (const key of result.unusedKeys) {
      lines.push(`  - ${key}`);
    }
    lines.push("");
  } else {
    lines.push("No unused keys in .env.example.");
    lines.push("");
  }

  return lines.join("\n");
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      printHelp();
      process.exit(0);
    }

    const result = analyzeDrift(path.resolve(args.root), {
      exampleFile: args.exampleFile,
      includeDirs: args.includeDirs,
      ignoreDirs: args.ignoreDirs,
      extensions: args.extensions,
    });

    if (args.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else {
      process.stdout.write(`${formatResult(result)}\n`);
    }

    const hasMissing = result.missingKeys.length > 0;
    const hasUnused = result.unusedKeys.length > 0;
    const hasFailure = hasMissing || (args.strict && hasUnused);
    process.exit(hasFailure ? 1 : 0);
  } catch (error) {
    process.stderr.write(`envdrift error: ${error.message}\n`);
    process.exit(2);
  }
}

if (require.main === module) {
  main();
}

module.exports = { formatResult, parseArgs };
