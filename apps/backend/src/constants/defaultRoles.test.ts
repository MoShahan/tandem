import { describe, expect, it } from "vitest";

import { DEFAULT_ORG_ROLES } from "./defaultRoles";
import { PERMISSIONS } from "./permissions";

const permissionsFor = (slug: string) => {
  const role = DEFAULT_ORG_ROLES.find((entry) => entry.slug === slug);
  if (!role) {
    throw new Error(`Missing default role ${slug}`);
  }
  return role.permissions;
};

describe("DEFAULT_ORG_ROLES", () => {
  it("gives org admin company numbers without sales write", () => {
    const permissions = permissionsFor("org_admin");
    expect(permissions).toEqual(
      expect.arrayContaining([
        PERMISSIONS.LEADS_READ_ORG,
        PERMISSIONS.DASHBOARD_ORG,
        PERMISSIONS.AUDIT_READ,
      ]),
    );
    expect(permissions).not.toContain(PERMISSIONS.LEADS_WRITE);
    expect(permissions).not.toContain(PERMISSIONS.ACTIVITIES_WRITE);
  });

  it("lets executives capture and work their own walk-ins", () => {
    expect(permissionsFor("executive")).toEqual(
      expect.arrayContaining([
        PERMISSIONS.LEADS_READ,
        PERMISSIONS.LEADS_WRITE,
        PERMISSIONS.LEADS_ASSIGNABLE,
        PERMISSIONS.LEADS_STATUS_WRITE,
        PERMISSIONS.ACTIVITIES_WRITE,
        PERMISSIONS.DASHBOARD_ME,
      ]),
    );
  });

  it("lets team leaders cover calls and own a lead", () => {
    expect(permissionsFor("team_lead")).toEqual(
      expect.arrayContaining([
        PERMISSIONS.LEADS_WRITE,
        PERMISSIONS.LEADS_ASSIGNABLE,
        PERMISSIONS.ACTIVITIES_WRITE,
        PERMISSIONS.DASHBOARD_TEAM,
      ]),
    );
  });

  it("gives sales managers the company dashboard", () => {
    expect(permissionsFor("sales_manager")).toEqual(
      expect.arrayContaining([
        PERMISSIONS.LEADS_READ_ORG,
        PERMISSIONS.LEADS_WRITE,
        PERMISSIONS.DASHBOARD_ORG,
      ]),
    );
  });

  it("gives directors the compliance log", () => {
    expect(permissionsFor("director")).toEqual(
      expect.arrayContaining([
        PERMISSIONS.LEADS_READ_ORG,
        PERMISSIONS.DASHBOARD_ORG,
        PERMISSIONS.AUDIT_READ,
      ]),
    );
  });
});
