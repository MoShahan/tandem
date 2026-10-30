import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

const eslintIn = (pkgDir) => (filenames) => {
  const pkgRoot = path.join(repoRoot, pkgDir);
  const files = filenames
    .map((file) => path.relative(pkgRoot, file).replaceAll("\\", "/"))
    .filter((file) => file.length > 0 && !file.startsWith("../"));

  if (files.length === 0) {
    return [];
  }

  const result = spawnSync("npx", ["eslint", "--fix", ...files], {
    cwd: pkgRoot,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    throw new Error(`eslint --fix failed in ${pkgDir}`);
  }

  return [];
};

export default {
  "*.md": "node eslint/no-em-dash.mjs",
  "apps/frontend/**/*.{js,jsx,mjs,cjs,ts,tsx}": eslintIn("apps/frontend"),
  "apps/backend/**/*.{js,mjs,cjs,ts}": eslintIn("apps/backend"),
};
