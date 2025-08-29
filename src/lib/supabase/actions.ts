'use server'

// Server Actions for handling form submissions and mutations
import { revalidatePath } from 'next/navigation'
import { redirect } from 'next/dist/client/navigation'
import { createPoll, castVote, updatePoll, deletePoll } from './db'
import { getCurrentUser } from './client'
import { CreatePollForm, CastVoteForm, PollUpdate } from './database.types'

// Poll Actions
export async function createPollAction(formData: FormData) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('You must be logged in to create a poll')
    }

    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const allowMultipleVotes = formData.get('allowMultipleVotes') === 'on'
    const expiresAt = formData.get('expiresAt') as string

    // Extract options (assuming they're named option-0, option-1, etc.)
    const options: string[] = []
    let optionIndex = 0
    while (formData.get(`option-${optionIndex}`)) {
      const option = formData.get(`option-${optionIndex}`) as string
      if (option.trim()) {
        options.push(option.trim())
      }
      optionIndex++
    }

    // Validate input
    if (!title?.trim()) {
      throw new Error('Poll title is required')
    }

    if (options.length < 2) {
      throw new Error('At least 2 options are required')
    }

    if (options.length > 10) {
      throw new Error('Maximum 10 options allowed')
    }

    // Create poll data
    const pollData: CreatePollForm = {
      title: title.trim(),
      description: description?.trim() || undefined,
      options,
      allow_multiple_votes: allowMultipleVotes,
      expires_at: expiresAt || undefined
    }

    // Create the poll
    const result = await createPoll(pollData, user.id)

    if (result.error) {
      throw new Error(result.error)
    }

    // Revalidate and redirect
    revalidatePath('/polls')
    redirect(`/polls/${result.data!.id}`)
  } catch (error) {
    console.error('Error creating poll:', error)
    throw error
  }
}

export async function createPollFromObject(pollData: CreatePollForm) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return { error: 'You must be logged in to create a poll' }
    }

    // Validate input
    if (!pollData.title?.trim()) {
      return { error: 'Poll title is required' }
    }

    if (pollData.options.length < 2) {
      return { error: 'At least 2 options are required' }
    }

    if (pollData.options.length > 10) {
      return { error: 'Maximum 10 options allowed' }
    }

    // Create the poll
    const result = await createPoll(pollData, user.id)

    if (result.error) {
      return { error: result.error }
    }

    // Revalidate paths
    revalidatePath('/polls')
    revalidatePath(`/polls/${result.data!.id}`)

    return { data: result.data, success: true }
  } catch (error) {
    console.error('Error creating poll:', error)
    return { error: 'Failed to create poll' }
  }
}

export async function updatePollAction(pollId: string, formData: FormData) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('You must be logged in to update a poll')
    }

    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const isActive = formData.get('isActive') === 'on'
    const expiresAt = formData.get('expiresAt') as string

    // Create update data
    const updates: PollUpdate = {}
    
    if (title?.trim()) {
      updates.title = title.trim()
    }
    
    if (description !== null) {
      updates.description = description?.trim() || null
    }
    
    updates.is_active = isActive
    
    if (expiresAt) {
      updates.expires_at = expiresAt
    }

    // Update the poll
    const result = await updatePoll(pollId, updates)

    if (result.error) {
      throw new Error(result.error)
    }

    // Revalidate paths
    revalidatePath('/polls')
    revalidatePath(`/polls/${pollId}`)

    return { success: true }
  } catch (error) {
    console.error('Error updating poll:', error)
    throw error
  }
}

export async function deletePollAction(pollId: string) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return { error: 'You must be logged in to delete a poll' }
    }

    // Delete the poll
    const result = await deletePoll(pollId)

    if (result.error) {
      return { error: result.error }
    }

    // Revalidate and redirect
    revalidatePath('/polls')
    redirect('/polls')
  } catch (error) {
    console.error('Error deleting poll:', error)
    return { error: 'Failed to delete poll' }
  }
}

// Vote Actions
export async function castVoteAction(formData: FormData) {
  try {
    // Extract form data
    const pollId = formData.get('pollId') as string
    const optionId = formData.get('optionId') as string
    const voterSession = formData.get('voterSession') as string

    if (!pollId || !optionId) {
      throw new Error('Poll ID and option ID are required')
    }

    // Get current user (optional for anonymous voting)
    const user = await getCurrentUser()

    // Create vote data
    const voteData: CastVoteForm = {
      poll_id: pollId,
      option_id: optionId,
      voter_session: voterSession || undefined
    }

    // Cast the vote
    const result = await castVote(voteData, user?.id)

    if (result.error) {
      throw new Error(result.error)
    }

    // Revalidate the poll page
    revalidatePath(`/polls/${pollId}`)

    return { success: true }
  } catch (error) {
    console.error('Error casting vote:', error)
    throw error
  }
}

export async function castVoteFromObject(voteData: CastVoteForm) {
  try {
    if (!voteData.poll_id || !voteData.option_id) {
      return { error: 'Poll ID and option ID are required' }
    }

    // Get current user (optional for anonymous voting)
    const user = await getCurrentUser()

    // Cast the vote
    const result = await castVote(voteData, user?.id)

    if (result.error) {
      return { error: result.error }
    }

    // Revalidate the poll page
    revalidatePath(`/polls/${voteData.poll_id}`)

    return { data: result.data, success: true }
  } catch (error) {
    console.error('Error casting vote:', error)
    return { error: 'Failed to cast vote' }
  }
}

// Auth Actions (basic implementations)
export async function signInAction(formData: FormData) {
  // This would be implemented with Supabase auth
  // For now, this is a placeholder
  throw new Error('Sign in action not implemented yet')
}

export async function signUpAction(formData: FormData) {
  // This would be implemented with Supabase auth
  // For now, this is a placeholder
  throw new Error('Sign up action not implemented yet')
}

export async function signOutAction() {
  // This would be implemented with Supabase auth
  // For now, this is a placeholder
  throw new Error('Sign out action not implemented yet')
}

// Utility Actions
export async function revalidatePollsAction() {
  revalidatePath('/polls')
}

export async function revalidatePollAction(pollId: string) {
  revalidatePath(`/polls/${pollId}`)
}