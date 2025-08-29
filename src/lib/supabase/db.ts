// Database utility functions for polls and votes
import { supabase, supabaseAdmin } from './client'
import {
  Poll,
  PollInsert,
  PollUpdate,
  PollOption,
  PollOptionInsert,
  Vote,
  VoteInsert,
  PollWithOptions,
  PollWithResults,
  CreatePollForm,
  CastVoteForm,
  PollFilters,
  ApiResponse
} from './database.types'

// Poll operations
export const createPoll = async (pollData: CreatePollForm, creatorId: string): Promise<ApiResponse<PollWithOptions>> => {
  try {
    // Create the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: pollData.title,
        description: pollData.description,
        creator_id: creatorId,
        allow_multiple_votes: pollData.allow_multiple_votes || false,
        expires_at: pollData.expires_at
      })
      .select()
      .single()

    if (pollError) {
      return { error: pollError.message }
    }

    // Create poll options
    const optionsToInsert: PollOptionInsert[] = pollData.options.map((option, index) => ({
      poll_id: poll.id,
      option_text: option,
      option_order: index
    }))

    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert)
      .select()

    if (optionsError) {
      // Rollback: delete the poll if options creation failed
      await supabase.from('polls').delete().eq('id', poll.id)
      return { error: optionsError.message }
    }

    return {
      data: {
        ...poll,
        poll_options: options
      }
    }
  } catch (error) {
    return { error: 'Failed to create poll' }
  }
}

export const getPoll = async (pollId: string): Promise<ApiResponse<PollWithOptions>> => {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (*),
        profiles:creator_id (id, full_name, email)
      `)
      .eq('id', pollId)
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    return { error: 'Failed to fetch poll' }
  }
}

export const getPollWithResults = async (pollId: string): Promise<ApiResponse<PollWithResults>> => {
  try {
    const { data, error } = await supabase
      .from('poll_results')
      .select('*')
      .eq('poll_id', pollId)

    if (error) {
      return { error: error.message }
    }

    if (!data || data.length === 0) {
      return { error: 'Poll not found' }
    }

    // Group results by poll
    const pollData = data[0]
    const poll: Poll = {
      id: pollData.poll_id,
      title: pollData.title,
      description: pollData.description,
      creator_id: pollData.creator_id,
      is_active: pollData.is_active,
      allow_multiple_votes: false, // This should come from the poll table
      expires_at: null, // This should come from the poll table
      created_at: pollData.created_at,
      updated_at: pollData.created_at // This should come from the poll table
    }

    const options = data
      .filter(row => row.option_id)
      .map(row => ({
        id: row.option_id!,
        poll_id: row.poll_id,
        option_text: row.option_text!,
        option_order: row.option_order!,
        created_at: pollData.created_at,
        vote_count: row.vote_count,
        vote_percentage: row.vote_percentage
      }))

    return {
      data: {
        ...poll,
        poll_options: options,
        total_votes: pollData.total_poll_votes,
        unique_voters: pollData.total_poll_votes // This is an approximation
      }
    }
  } catch (error) {
    return { error: 'Failed to fetch poll results' }
  }
}

export const getPolls = async (filters: PollFilters = {}): Promise<ApiResponse<Poll[]>> => {
  try {
    let query = supabase
      .from('polls')
      .select(`
        *,
        profiles:creator_id (id, full_name),
        poll_analytics (total_votes, unique_voters)
      `)

    // Apply filters
    if (filters.creator_id) {
      query = query.eq('creator_id', filters.creator_id)
    }
    
    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }

    // Apply sorting
    const sortBy = filters.sort_by || 'created_at'
    const sortOrder = filters.sort_order || 'desc'
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      return { error: error.message }
    }

    return { data: data || [] }
  } catch (error) {
    return { error: 'Failed to fetch polls' }
  }
}

export const updatePoll = async (pollId: string, updates: PollUpdate): Promise<ApiResponse<Poll>> => {
  try {
    const { data, error } = await supabase
      .from('polls')
      .update(updates)
      .eq('id', pollId)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    return { error: 'Failed to update poll' }
  }
}

export const deletePoll = async (pollId: string): Promise<ApiResponse<void>> => {
  try {
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (error) {
      return { error: error.message }
    }

    return { data: undefined }
  } catch (error) {
    return { error: 'Failed to delete poll' }
  }
}

// Vote operations
export const castVote = async (voteData: CastVoteForm, voterId?: string): Promise<ApiResponse<Vote>> => {
  try {
    // Check if poll exists and is active
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, is_active, expires_at, allow_multiple_votes')
      .eq('id', voteData.poll_id)
      .single()

    if (pollError || !poll) {
      return { error: 'Poll not found' }
    }

    if (!poll.is_active) {
      return { error: 'Poll is not active' }
    }

    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return { error: 'Poll has expired' }
    }

    // Check if user has already voted (if not allowing multiple votes)
    if (!poll.allow_multiple_votes && voterId) {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', voteData.poll_id)
        .eq('voter_id', voterId)
        .single()

      if (existingVote) {
        return { error: 'You have already voted on this poll' }
      }
    }

    // Cast the vote
    const voteInsert: VoteInsert = {
      poll_id: voteData.poll_id,
      option_id: voteData.option_id,
      voter_id: voterId,
      voter_session: voteData.voter_session
    }

    const { data, error } = await supabase
      .from('votes')
      .insert(voteInsert)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    return { error: 'Failed to cast vote' }
  }
}

export const getUserVote = async (pollId: string, voterId: string): Promise<ApiResponse<Vote | null>> => {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('poll_id', pollId)
      .eq('voter_id', voterId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      return { error: error.message }
    }

    return { data: data || null }
  } catch (error) {
    return { error: 'Failed to fetch user vote' }
  }
}

// Analytics operations
export const getPollAnalytics = async (pollId: string) => {
  try {
    const { data, error } = await supabase
      .from('poll_analytics')
      .select('*')
      .eq('poll_id', pollId)
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    return { error: 'Failed to fetch poll analytics' }
  }
}

// Utility functions
export const generatePollUrl = (pollId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/polls/${pollId}`
}

export const isPollExpired = (poll: Poll): boolean => {
  if (!poll.expires_at) return false
  return new Date(poll.expires_at) < new Date()
}

export const canUserVote = (poll: Poll, hasVoted: boolean): boolean => {
  if (!poll.is_active) return false
  if (isPollExpired(poll)) return false
  if (hasVoted && !poll.allow_multiple_votes) return false
  return true
}