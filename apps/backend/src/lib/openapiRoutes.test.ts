import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const routesDir = join(here, "../routes");
const openapiPath = join(here, "../../../../docs/openapi.yaml");

const toOpenApiPath = (mount: string, routePath: string) => {
  const suffix = routePath === "/" ? "" : routePath.replace(/:([A-Za-z]+)/g, "{$1}");
  return `${mount}${suffix}` || "/";
};

const parseMountedRoutes = () => {
  const indexSource = readFileSync(join(routesDir, "index.ts"), "utf8");
  const mounts = [
    ...indexSource.matchAll(
      /router\.use\(\s*["']([^"']+)["']\s*,\s*(\w+)Routes\)/g,
    ),
  ];

  const operations: string[] = [];

  for (const [, mount, name] of mounts) {
    const fileName = `${name.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`).replace(/^-/, "")}.routes.ts`;
    const source = readFileSync(join(routesDir, fileName), "utf8");
    const routeMatches = [
      ...source.matchAll(
        /router\.(get|post|patch|put|delete)\(\s*["']([^"']+)["']/g,
      ),
    ];

    for (const [, method, routePath] of routeMatches) {
      operations.push(
        `${method.toUpperCase()} ${toOpenApiPath(mount!, routePath!)}`,
      );
    }
  }

  return operations.sort();
};

const parseOpenApiOperations = () => {
  const yaml = readFileSync(openapiPath, "utf8");
  const operations: string[] = [];
  let currentPath: string | null = null;

  for (const line of yaml.split(/\r?\n/)) {
    const pathMatch = line.match(/^  (\/[^\s:]+):$/);
    if (pathMatch) {
      currentPath = pathMatch[1]!;
      continue;
    }

    if (!currentPath) {
      continue;
    }

    const methodMatch = line.match(/^    (get|post|patch|put|delete):$/);
    if (methodMatch) {
      operations.push(`${methodMatch[1]!.toUpperCase()} ${currentPath}`);
    }
  }

  return operations.sort();
};

describe("OpenAPI route coverage", () => {
  it("lists every Express route in docs/openapi.yaml", () => {
    expect(parseOpenApiOperations()).toEqual(parseMountedRoutes());
  });

  it("documents current route files", () => {
    const files = readdirSync(routesDir).filter((name) =>
      name.endsWith(".routes.ts"),
    );
    expect(files.sort()).toEqual(
      [
        "audit.routes.ts",
        "auth.routes.ts",
        "dashboard.routes.ts",
        "health.routes.ts",
        "lead.routes.ts",
        "notification.routes.ts",
        "permission.routes.ts",
        "platform.routes.ts",
        "role.routes.ts",
        "team.routes.ts",
        "user.routes.ts",
      ].sort(),
    );
  });
});
