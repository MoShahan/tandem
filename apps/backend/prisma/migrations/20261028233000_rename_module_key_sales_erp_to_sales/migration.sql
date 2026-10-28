-- Rename stored module key SALES_ERP → SALES.
-- PostgreSQL updates existing organization_modules rows with the enum value.
ALTER TYPE "ModuleKey" RENAME VALUE 'SALES_ERP' TO 'SALES';
