-- Create crops table for Agromia
CREATE TABLE IF NOT EXISTS crops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  plants INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own crops
CREATE POLICY "Users can only see their own crops" ON crops
  FOR ALL USING (auth.uid() = user_id);

-- Create policy for inserting crops
CREATE POLICY "Users can insert their own crops" ON crops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for updating crops
CREATE POLICY "Users can update their own crops" ON crops
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for deleting crops
CREATE POLICY "Users can delete their own crops" ON crops
  FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS crops_user_id_idx ON crops(user_id);