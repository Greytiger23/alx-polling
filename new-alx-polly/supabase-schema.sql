-- Supabase Database Schema for Polling App with QR Code Sharing
-- This schema supports user authentication, poll creation, voting, and analytics

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table (extends Supabase auth.users)
-- This table stores additional user profile information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Polls table
-- Stores poll information and metadata
CREATE TABLE public.polls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL CHECK (length(title) > 0 AND length(title) <= 200),
  description TEXT CHECK (length(description) <= 1000),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  allow_multiple_votes BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes for performance
  CONSTRAINT polls_title_not_empty CHECK (length(trim(title)) > 0)
);

-- Poll options table
-- Stores the available options for each poll
CREATE TABLE public.poll_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL CHECK (length(option_text) > 0 AND length(option_text) <= 200),
  option_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique option order within each poll
  UNIQUE(poll_id, option_order),
  CONSTRAINT poll_options_text_not_empty CHECK (length(trim(option_text)) > 0)
);

-- Votes table
-- Stores individual votes cast by users
CREATE TABLE public.votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  voter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  voter_ip INET, -- For anonymous voting tracking
  voter_session TEXT, -- For anonymous voting session tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate votes (either by user or by IP/session for anonymous)
  UNIQUE(poll_id, voter_id),
  UNIQUE(poll_id, voter_ip, voter_session)
);

-- Poll analytics table (optional)
-- Stores aggregated analytics data for performance
CREATE TABLE public.poll_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  total_votes INTEGER DEFAULT 0,
  unique_voters INTEGER DEFAULT 0,
  last_vote_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(poll_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_polls_creator_id ON public.polls(creator_id);
CREATE INDEX idx_polls_created_at ON public.polls(created_at DESC);
CREATE INDEX idx_polls_active ON public.polls(is_active) WHERE is_active = true;
CREATE INDEX idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX idx_votes_option_id ON public.votes(option_id);
CREATE INDEX idx_votes_voter_id ON public.votes(voter_id);
CREATE INDEX idx_votes_created_at ON public.votes(created_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Polls policies
CREATE POLICY "Anyone can view active polls" ON public.polls
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own polls" ON public.polls
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can create polls" ON public.polls
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own polls" ON public.polls
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own polls" ON public.polls
  FOR DELETE USING (auth.uid() = creator_id);

-- Poll options policies
CREATE POLICY "Anyone can view poll options for active polls" ON public.poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.is_active = true
    )
  );

CREATE POLICY "Poll creators can manage their poll options" ON public.poll_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.creator_id = auth.uid()
    )
  );

-- Votes policies
CREATE POLICY "Anyone can view votes for active polls" ON public.votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id 
      AND polls.is_active = true
    )
  );

CREATE POLICY "Users can vote on active polls" ON public.votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id 
      AND polls.is_active = true
      AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
    )
  );

CREATE POLICY "Users can view their own votes" ON public.votes
  FOR SELECT USING (auth.uid() = voter_id);

-- Poll analytics policies
CREATE POLICY "Anyone can view poll analytics" ON public.poll_analytics
  FOR SELECT USING (true);

CREATE POLICY "System can update poll analytics" ON public.poll_analytics
  FOR ALL USING (true); -- This should be restricted to service role in production

-- Functions and Triggers

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update poll analytics
CREATE OR REPLACE FUNCTION public.update_poll_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.poll_analytics (poll_id, total_votes, unique_voters, last_vote_at)
  VALUES (
    NEW.poll_id,
    (SELECT COUNT(*) FROM public.votes WHERE poll_id = NEW.poll_id),
    (SELECT COUNT(DISTINCT COALESCE(voter_id::text, voter_ip::text || voter_session)) FROM public.votes WHERE poll_id = NEW.poll_id),
    NEW.created_at
  )
  ON CONFLICT (poll_id) DO UPDATE SET
    total_votes = (SELECT COUNT(*) FROM public.votes WHERE poll_id = NEW.poll_id),
    unique_voters = (SELECT COUNT(DISTINCT COALESCE(voter_id::text, voter_ip::text || voter_session)) FROM public.votes WHERE poll_id = NEW.poll_id),
    last_vote_at = NEW.created_at,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update analytics on new vote
CREATE TRIGGER on_vote_created
  AFTER INSERT ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.update_poll_analytics();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_polls_updated_at
  BEFORE UPDATE ON public.polls
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Views for easier querying

-- View for poll results
CREATE VIEW public.poll_results AS
SELECT 
  p.id as poll_id,
  p.title,
  p.description,
  p.creator_id,
  prof.full_name as creator_name,
  p.created_at,
  p.is_active,
  po.id as option_id,
  po.option_text,
  po.option_order,
  COUNT(v.id) as vote_count,
  COALESCE(pa.total_votes, 0) as total_poll_votes,
  CASE 
    WHEN COALESCE(pa.total_votes, 0) > 0 
    THEN ROUND((COUNT(v.id)::numeric / pa.total_votes::numeric) * 100, 2)
    ELSE 0
  END as vote_percentage
FROM public.polls p
LEFT JOIN public.profiles prof ON p.creator_id = prof.id
LEFT JOIN public.poll_options po ON p.id = po.poll_id
LEFT JOIN public.votes v ON po.id = v.option_id
LEFT JOIN public.poll_analytics pa ON p.id = pa.poll_id
GROUP BY p.id, p.title, p.description, p.creator_id, prof.full_name, p.created_at, p.is_active, po.id, po.option_text, po.option_order, pa.total_votes
ORDER BY p.created_at DESC, po.option_order ASC;

-- View for poll summary
CREATE VIEW public.poll_summary AS
SELECT 
  p.id,
  p.title,
  p.description,
  p.creator_id,
  prof.full_name as creator_name,
  p.created_at,
  p.updated_at,
  p.is_active,
  p.expires_at,
  COUNT(DISTINCT po.id) as option_count,
  COALESCE(pa.total_votes, 0) as total_votes,
  COALESCE(pa.unique_voters, 0) as unique_voters,
  pa.last_vote_at
FROM public.polls p
LEFT JOIN public.profiles prof ON p.creator_id = prof.id
LEFT JOIN public.poll_options po ON p.id = po.poll_id
LEFT JOIN public.poll_analytics pa ON p.id = pa.poll_id
GROUP BY p.id, p.title, p.description, p.creator_id, prof.full_name, p.created_at, p.updated_at, p.is_active, p.expires_at, pa.total_votes, pa.unique_voters, pa.last_vote_at
ORDER BY p.created_at DESC;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Sample data (optional - remove in production)
-- INSERT INTO public.profiles (id, email, full_name) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'demo@example.com', 'Demo User');

-- Comments for documentation
COMMENT ON TABLE public.profiles IS 'Extended user profile information';
COMMENT ON TABLE public.polls IS 'Poll definitions and metadata';
COMMENT ON TABLE public.poll_options IS 'Available options for each poll';
COMMENT ON TABLE public.votes IS 'Individual votes cast by users';
COMMENT ON TABLE public.poll_analytics IS 'Aggregated analytics for poll performance';
COMMENT ON VIEW public.poll_results IS 'Detailed poll results with vote counts and percentages';
COMMENT ON VIEW public.poll_summary IS 'Summary information for all polls';