-- Align built-in org roles with real-world jobs. Additive only.

-- Office / HR / ops: company numbers, still not a salesperson
INSERT INTO "role_permissions" ("role_id", "permission_key")
SELECT r."id", 'dashboard:org'
FROM "roles" r
WHERE r."slug" = 'org_admin'
ON CONFLICT DO NOTHING;

-- Salesperson: capture walk-ins they sourced
INSERT INTO "role_permissions" ("role_id", "permission_key")
SELECT r."id", 'leads:write'
FROM "roles" r
WHERE r."slug" = 'executive'
ON CONFLICT DO NOTHING;

-- Playing manager: cover calls and own a lead when they take it
INSERT INTO "role_permissions" ("role_id", "permission_key")
SELECT r."id", p."key"
FROM "roles" r
CROSS JOIN (VALUES ('activities:write'), ('leads:assignable')) AS p("key")
WHERE r."slug" = 'team_lead'
ON CONFLICT DO NOTHING;

-- Sales manager: live in reports
INSERT INTO "role_permissions" ("role_id", "permission_key")
SELECT r."id", 'dashboard:org'
FROM "roles" r
WHERE r."slug" = 'sales_manager'
ON CONFLICT DO NOTHING;

-- Head of sales: compliance log
INSERT INTO "role_permissions" ("role_id", "permission_key")
SELECT r."id", 'audit:read'
FROM "roles" r
WHERE r."slug" = 'director'
ON CONFLICT DO NOTHING;
