const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const { analyzeDrift } = require("../src/drift");

function makeFixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "envdrift-"));
  for (const [relative, content] of Object.entries(files)) {
    const absolute = path.join(root, relative);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, content);
  }
  return root;
}

test("analyzeDrift detects missing and unused keys", () => {
  const root = makeFixture({
    ".env.example": ["DATABASE_URL=", "PORT=", "UNUSED_KEY=", ""].join("\n"),
    "src/index.ts": [
      "const db = process.env.DATABASE_URL;",
      "const key = process.env.API_KEY;",
      "console.log(import.meta.env.VITE_API_URL);",
      "",
    ].join("\n"),
    "api/main.py": 'token = os.environ.get("TOKEN")\n',
  });

  const result = analyzeDrift(root);

  assert.deepEqual(result.missingKeys, ["API_KEY", "TOKEN", "VITE_API_URL"]);
  assert.deepEqual(result.unusedKeys, ["PORT", "UNUSED_KEY"]);
  assert.equal(result.filesScanned, 2);
});

test("CLI exit code follows strict mode", () => {
  const root = makeFixture({
    ".env.example": ["USED_OK=", "STALE=", ""].join("\n"),
    "src/index.js": "console.log(process.env.USED_OK)\n",
  });

  const cli = path.join(__dirname, "..", "bin", "envdrift.js");

  const nonStrict = spawnSync("node", [cli, root], { encoding: "utf8" });
  assert.equal(nonStrict.status, 0);
  assert.match(nonStrict.stdout, /Unused in \.env\.example/);

  const strict = spawnSync("node", [cli, root, "--strict"], { encoding: "utf8" });
  assert.equal(strict.status, 1);
});

test("include supports nested directories", () => {
  const root = makeFixture({
    ".env.example": "NESTED_OK=\n",
    "apps/web/src/main.ts": "console.log(process.env.NESTED_OK)\n",
    "apps/api/main.ts": "console.log(process.env.SHOULD_NOT_SCAN)\n",
  });

  const result = analyzeDrift(root, { includeDirs: "apps/web" });
  assert.deepEqual(result.missingKeys, []);
  assert.deepEqual(result.usedKeys, ["NESTED_OK"]);
});
