-- Migration: Add transplant_date support to crops

ALTER TABLE IF EXISTS crops
ADD COLUMN IF NOT EXISTS transplant_date DATE;

-- Ensure users can continue to insert crops with or without a transplant date
CREATE POLICY IF NOT EXISTS "Users can insert crops with transplant date" ON crops
  FOR INSERT WITH CHECK (auth.uid() = user_id);
