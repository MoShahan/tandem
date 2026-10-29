import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const EM_DASH = "\u2014";
export const HYPHEN = "-";

export const replaceEmDashes = (text) => text.replaceAll(EM_DASH, HYPHEN);

const checkNode = (context, node) => {
  const sourceCode = context.sourceCode;
  const text = sourceCode.getText(node);
  const start = node.range[0];
  let from = 0;
  let index = text.indexOf(EM_DASH, from);

  while (index !== -1) {
    const rangeStart = start + index;
    const rangeEnd = rangeStart + EM_DASH.length;

    context.report({
      node,
      loc: {
        start: sourceCode.getLocFromIndex(rangeStart),
        end: sourceCode.getLocFromIndex(rangeEnd),
      },
      messageId: "noEmDash",
      fix: (fixer) => fixer.replaceTextRange([rangeStart, rangeEnd], HYPHEN),
    });

    from = index + EM_DASH.length;
    index = text.indexOf(EM_DASH, from);
  }
};

export const noEmDashRule = {
  meta: {
    type: "layout",
    docs: {
      description: "Disallow em dashes (—); use a hyphen (-) instead",
    },
    fixable: "code",
    messages: {
      noEmDash: "Replace the em dash (—) with a hyphen (-).",
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        checkNode(context, node);
      },
      TemplateElement(node) {
        checkNode(context, node);
      },
      JSXText(node) {
        checkNode(context, node);
      },
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          checkNode(context, comment);
        }
      },
    };
  },
};

export const tandemEslintPlugin = {
  rules: {
    "no-em-dash": noEmDashRule,
  },
};

const thisFile = fileURLToPath(import.meta.url);
const invokedAsCli =
  Boolean(process.argv[1]) &&
  path.normalize(thisFile) === path.normalize(path.resolve(process.argv[1]));

if (invokedAsCli) {
  const repoRoot = fileURLToPath(new URL("..", import.meta.url));
  const skipDirs = new Set([".git", "dist", "node_modules"]);
  const requested = process.argv.slice(2).filter((value) => !value.startsWith("-"));

  const walkMarkdownFiles = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) {
          files.push(...(await walkMarkdownFiles(path.join(dir, entry.name))));
        }
        continue;
      }

      if (entry.name.endsWith(".md")) {
        files.push(path.join(dir, entry.name));
      }
    }

    return files;
  };

  const files =
    requested.length > 0
      ? requested
          .map((file) => path.resolve(process.cwd(), file))
          .filter((file) => file.endsWith(".md"))
      : await walkMarkdownFiles(repoRoot);

  for (const file of files) {
    const original = await readFile(file, "utf8");
    if (original.includes(EM_DASH)) {
      await writeFile(file, replaceEmDashes(original), "utf8");
    }
  }
}
