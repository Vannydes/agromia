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
