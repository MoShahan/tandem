-- Lost reason, optional won value, and expected close date on leads.
ALTER TABLE "leads" ADD COLUMN "lost_reason" TEXT;
ALTER TABLE "leads" ADD COLUMN "deal_value" DECIMAL(12,2);
ALTER TABLE "leads" ADD COLUMN "expected_close_date" DATE;
