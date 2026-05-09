-- Create crops table for Agromia
CREATE TABLE IF NOT EXISTS crops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  plants INTEGER NOT NULL DEFAULT 0,
  custom_crop_id UUID REFERENCES custom_crops(id) ON DELETE SET NULL,
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

-- Create custom_crops table for user-defined crops
CREATE TABLE IF NOT EXISTS custom_crops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  spacing_cm INTEGER NOT NULL,
  min_yield DECIMAL(10,2) NOT NULL,
  max_yield DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE custom_crops ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own custom crops
CREATE POLICY "Users can only see their own custom crops" ON custom_crops
  FOR ALL USING (auth.uid() = user_id);

-- Create policy for inserting custom crops
CREATE POLICY "Users can insert their own custom crops" ON custom_crops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for updating custom crops
CREATE POLICY "Users can update their own custom crops" ON custom_crops
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for deleting custom crops
CREATE POLICY "Users can delete their own custom crops" ON custom_crops
  FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS custom_crops_user_id_idx ON custom_crops(user_id);

-- Create feedback table for user suggestions
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own feedback
CREATE POLICY "Users can insert their own feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to select only their own feedback
CREATE POLICY "Users can see their own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS feedback_user_id_idx ON feedback(user_id);