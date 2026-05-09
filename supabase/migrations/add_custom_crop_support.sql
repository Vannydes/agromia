-- Migration: Add custom crop support to crops table
-- This migration adds the custom_crop_id column to the crops table
-- if it doesn't already exist

-- Add custom_crop_id column to crops table if it doesn't exist
ALTER TABLE IF EXISTS crops
ADD COLUMN IF NOT EXISTS custom_crop_id UUID REFERENCES custom_crops(id) ON DELETE SET NULL;

-- Create custom_crops table if it doesn't exist
CREATE TABLE IF NOT EXISTS custom_crops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  spacing_cm INTEGER NOT NULL,
  min_yield DECIMAL(10,2) NOT NULL,
  max_yield DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on custom_crops if not already enabled
ALTER TABLE custom_crops ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for custom_crops
CREATE POLICY IF NOT EXISTS "Users can only see their own custom crops" ON custom_crops
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own custom crops" ON custom_crops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own custom crops" ON custom_crops
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own custom crops" ON custom_crops
  FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS custom_crops_user_id_idx ON custom_crops(user_id);
