# Supabase Database Setup Guide

This guide will help you set up the Supabase database schema for the Polling App with QR Code Sharing.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project created
3. Node.js and npm installed

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "alx-polling-app")
5. Create a strong database password
6. Select a region close to your users
7. Click "Create new project"

## Step 2: Set Up Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. In your Supabase project dashboard, go to Settings > API
3. Copy the following values to your `.env.local` file:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

4. Update `NEXT_PUBLIC_APP_URL` to match your application URL:
   - For development: `http://localhost:3000`
   - For production: your actual domain

## Step 3: Run the Database Schema

1. In your Supabase project dashboard, go to the SQL Editor
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` and paste it into the SQL editor
4. Click "Run" to execute the schema

Alternatively, you can use the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project reference)
supabase link --project-ref your-project-ref

# Run the schema
supabase db push
```

## Step 4: Verify the Setup

After running the schema, you should see the following tables in your Supabase database:

### Tables
- `profiles` - Extended user profile information
- `polls` - Poll definitions and metadata
- `poll_options` - Available options for each poll
- `votes` - Individual votes cast by users
- `poll_analytics` - Aggregated analytics for poll performance

### Views
- `poll_results` - Detailed poll results with vote counts and percentages
- `poll_summary` - Summary information for all polls

### Functions & Triggers
- `handle_new_user()` - Automatically creates a profile when a user signs up
- `update_poll_analytics()` - Updates poll analytics when votes are cast
- `update_updated_at_column()` - Updates timestamp columns automatically

## Step 5: Configure Row Level Security (RLS)

The schema automatically enables Row Level Security with the following policies:

### Profiles
- Users can view, update, and insert their own profile

### Polls
- Anyone can view active polls
- Users can view, create, update, and delete their own polls

### Poll Options
- Anyone can view options for active polls
- Poll creators can manage their poll options

### Votes
- Anyone can view votes for active polls
- Users can vote on active polls (with duplicate prevention)
- Users can view their own votes

### Poll Analytics
- Anyone can view poll analytics
- System can update analytics (restricted to service role in production)

## Step 6: Test the Setup

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Try creating an account and logging in
4. Create a test poll to verify everything is working

## Database Schema Overview

### Core Tables Relationships

```
auth.users (Supabase Auth)
    ↓
profiles (1:1)
    ↓
polls (1:many)
    ↓
poll_options (1:many)
    ↓
votes (many:1)
```

### Key Features

1. **User Authentication**: Integrated with Supabase Auth
2. **Poll Management**: Create, update, delete polls with options
3. **Voting System**: Support for single and multiple votes per user
4. **Anonymous Voting**: Support for voting without authentication
5. **Analytics**: Real-time vote counting and analytics
6. **Security**: Row Level Security policies for data protection
7. **Performance**: Optimized indexes and views for fast queries

## Troubleshooting

### Common Issues

1. **"relation does not exist" errors**
   - Make sure you ran the complete schema in the SQL editor
   - Check that all tables were created successfully

2. **Authentication errors**
   - Verify your environment variables are correct
   - Make sure the anon key and service role key are properly set

3. **Permission denied errors**
   - Check that Row Level Security policies are properly configured
   - Ensure users are authenticated when required

4. **Connection errors**
   - Verify your Supabase project URL is correct
   - Check that your project is not paused (free tier limitation)

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Community](https://github.com/supabase/supabase/discussions)
- Review the application logs for detailed error messages

## Production Considerations

1. **Environment Variables**: Use secure environment variable management
2. **Database Backups**: Enable automatic backups in Supabase
3. **Rate Limiting**: Consider implementing rate limiting for voting
4. **Monitoring**: Set up monitoring and alerts for your database
5. **Security**: Regularly review and update RLS policies
6. **Performance**: Monitor query performance and add indexes as needed

## Next Steps

After setting up the database:

1. Install project dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Begin implementing authentication flows
4. Test poll creation and voting functionality
5. Implement QR code generation for poll sharing
6. Add real-time updates for live poll results