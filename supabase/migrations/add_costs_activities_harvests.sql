-- Migration: Add costs, activities, and harvests tables
-- These tables persist user crop data to the database and enable sync across devices

-- Create costs table
CREATE TABLE IF NOT EXISTS costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on costs
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for costs
CREATE POLICY IF NOT EXISTS "Users can see their own crop costs" ON costs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert costs for their crops" ON costs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own costs" ON costs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own costs" ON costs
  FOR DELETE USING (auth.uid() = user_id);

-- Create index on crop_id and user_id for better performance
CREATE INDEX IF NOT EXISTS costs_crop_id_idx ON costs(crop_id);
CREATE INDEX IF NOT EXISTS costs_user_id_idx ON costs(user_id);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('semina', 'trapianto', 'concimazione', 'irrigazione', 'raccolta')),
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for activities
CREATE POLICY IF NOT EXISTS "Users can see their own crop activities" ON activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert activities for their crops" ON activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own activities" ON activities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own activities" ON activities
  FOR DELETE USING (auth.uid() = user_id);

-- Create index on crop_id and user_id for better performance
CREATE INDEX IF NOT EXISTS activities_crop_id_idx ON activities(crop_id);
CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id);
CREATE INDEX IF NOT EXISTS activities_date_idx ON activities(date);

-- Create harvests table
CREATE TABLE IF NOT EXISTS harvests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on harvests
ALTER TABLE harvests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for harvests
CREATE POLICY IF NOT EXISTS "Users can see their own crop harvests" ON harvests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert harvests for their crops" ON harvests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own harvests" ON harvests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own harvests" ON harvests
  FOR DELETE USING (auth.uid() = user_id);

-- Create index on crop_id and user_id for better performance
CREATE INDEX IF NOT EXISTS harvests_crop_id_idx ON harvests(crop_id);
CREATE INDEX IF NOT EXISTS harvests_user_id_idx ON harvests(user_id);
CREATE INDEX IF NOT EXISTS harvests_created_at_idx ON harvests(created_at);
