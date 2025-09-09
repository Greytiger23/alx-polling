'use server'

/**
 * Server Actions for ALX Polly - Poll Management and Voting System
 * 
 * This module contains Next.js Server Actions that handle form submissions
 * and mutations for the polling application. Server Actions provide a secure
 * way to handle data mutations on the server side while maintaining excellent
 * performance and user experience.
 * 
 * All functions in this module:
 * - Run on the server side only
 * - Handle authentication and authorization
 * - Validate input data before processing
 * - Provide proper error handling and user feedback
 * - Revalidate cached data when necessary
 * 
 * @module actions
 */

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createPoll, castVote, updatePoll, deletePoll } from './db'
import { getCurrentUser } from './client'
import { CreatePollForm, CastVoteForm, PollUpdate } from './database.types'

/**
 * Creates a new poll from form data submitted by users.
 * 
 * This Server Action handles the complete poll creation workflow:
 * 1. Authenticates the current user
 * 2. Extracts and validates form data
 * 3. Creates the poll in the database
 * 4. Redirects to the new poll page
 * 
 * The function expects form data with:
 * - title: Poll question/title (required)
 * - description: Optional poll description
 * - allowMultipleVotes: Checkbox for multiple vote permission
 * - expiresAt: Optional expiration date
 * - option-0, option-1, etc.: Poll options (minimum 2, maximum 10)
 * 
 * @param {FormData} formData - Form data from the poll creation form
 * @returns {Promise<{error?: string} | never>} Error object or redirects on success
 * @throws {Error} When user is not authenticated or validation fails
 */
export async function createPollAction(formData: FormData) {
  try {
    // Step 1: Authentication - Verify user is logged in
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('You must be logged in to create a poll')
    }

    // Step 2: Data Extraction - Get form values with type safety
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const allowMultipleVotes = formData.get('allowMultipleVotes') === 'on' // Checkbox handling
    const expiresAt = formData.get('expiresAt') as string

    // Step 3: Dynamic Option Extraction - Handle variable number of poll options
    // Options are expected to be named option-0, option-1, option-2, etc.
    const options: string[] = []
    let optionIndex = 0
    
    // Loop through all possible option fields until we find no more
    while (formData.get(`option-${optionIndex}`)) {
      const option = formData.get(`option-${optionIndex}`) as string
      
      // Only add non-empty options (trim whitespace)
      if (option.trim()) {
        options.push(option.trim())
      }
      optionIndex++
    }

    // Step 4: Input Validation - Ensure data meets business requirements
    if (!title?.trim()) {
      throw new Error('Poll title is required')
    }

    // Minimum options validation - polls need at least 2 choices
    if (options.length < 2) {
      throw new Error('At least 2 options are required')
    }

    // Maximum options validation - prevent UI/UX issues with too many options
    if (options.length > 10) {
      throw new Error('Maximum 10 options allowed')
    }

    // Step 5: Data Preparation - Structure data for database insertion
    const pollData: CreatePollForm = {
      title: title.trim(),
      options
    }

    // Step 6: Database Operation - Create poll with associated options
    const result = await createPoll(pollData, user.id)

    // Step 7: Cache Invalidation & Navigation - Update cached data and redirect
    revalidatePath('/polls') // Refresh polls listing page
    redirect(`/polls/${result.id}`) // Navigate to newly created poll
  } catch (error: any) {
    // Error handling - Log for debugging and return user-friendly message
    console.error('Error creating poll:', error)
    return { error: error.message || 'Failed to create poll' }
  }
}

/**
 * Casts a vote for a specific poll option using form data.
 * 
 * This Server Action handles the voting workflow:
 * 1. Extracts poll and option IDs from form data
 * 2. Validates required parameters
 * 3. Gets current user (voting can be anonymous or authenticated)
 * 4. Records the vote in the database
 * 5. Revalidates the poll page to show updated results
 * 
 * @param {FormData} formData - Form data containing pollId and optionId
 * @returns {Promise<{success?: boolean, error?: string}>} Success status or error message
 * @throws {Error} When required parameters are missing or vote fails
 */
export async function castVoteAction(formData: FormData) {
  try {
    // Step 1: Extract vote parameters from form submission
    const pollId = formData.get('pollId') as string
    const optionId = formData.get('optionId') as string

    // Step 2: Validate required parameters - both IDs must be present
    if (!pollId || !optionId) {
      throw new Error('Poll ID and Option ID are required')
    }

    // Step 3: Get current user - voting may be anonymous (userId can be null)
    const user = await getCurrentUser()
    const userId = user?.id // Optional - supports anonymous voting

    // Step 4: Prepare vote data structure
    const voteData: CastVoteForm = {
      pollId,
      optionId
    }

    // Step 5: Record the vote in database (handles duplicate vote prevention)
    await castVote(voteData, userId)

    // Step 6: Refresh poll page to show updated vote counts
    revalidatePath(`/polls/${pollId}`)
    return { success: true }
  } catch (error: any) {
    // Error handling - Log for debugging and return user-friendly message
    console.error('Error casting vote:', error)
    return { error: error.message || 'Failed to cast vote' }
  }
}

/**
 * Creates a poll from a structured data object (alternative to form-based creation).
 * 
 * This function provides a programmatic way to create polls, useful for:
 * - API endpoints that receive JSON data
 * - Bulk poll creation operations
 * - Integration with external systems
 * 
 * Unlike the form-based createPollAction, this function:
 * - Accepts structured data directly
 * - Returns detailed success/error information
 * - Doesn't perform automatic redirects
 * 
 * @param {CreatePollData} data - Structured poll data object
 * @returns {Promise<ActionResult>} Result object with success status and data/error
 * @throws {Error} When database operations fail
 */
export async function createPollFromObject(data: CreatePollData): Promise<ActionResult> {
  try {
    // Step 1: Initialize Supabase client for server-side operations
    const supabase = supabaseServer();
    
    // Step 2: Authenticate user - polls require authenticated creators
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to create a poll' };
    }

    // Step 3: Create poll with user as owner
    const poll = await createPoll({
      title: data.title,
      description: data.description,
      options: data.options,
      created_by: user.id
    });

    // Step 4: Validate poll creation success
    if (!poll) {
      return { success: false, error: 'Failed to create poll' };
    }

    // Step 5: Invalidate cached polls data
    revalidatePath('/polls');
    return { success: true, data: poll };
  } catch (error) {
    // Error handling - Log and return structured error response
    console.error('Error creating poll:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Alternative form-based poll creation action (simplified version).
 * 
 * This is a streamlined version of poll creation that:
 * - Extracts data from FormData using getAll() for options
 * - Delegates to createPollFromObject for the actual creation
 * - Automatically redirects on success
 * - Throws errors instead of returning them
 * 
 * Note: This appears to be a duplicate of the main createPollAction above.
 * Consider consolidating these functions to avoid confusion.
 * 
 * @param {FormData} formData - Form data with title, description, and option fields
 * @throws {Error} When poll creation fails
 * @returns {never} Always redirects on success
 */
export async function createPollAction(formData: FormData) {
  // Extract form fields - using getAll() for multiple option inputs
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const options = formData.getAll('option') as string[]; // Multiple option fields

  // Delegate to object-based creation with filtered options
  const result = await createPollFromObject({
    title,
    description: description || undefined, // Convert empty string to undefined
    options: options.filter(option => option.trim() !== '') // Remove empty options
  });

  // Handle errors by throwing (different from main createPollAction)
  if (!result.success) {
    throw new Error(result.error || 'Failed to create poll');
  }

  // Redirect to polls listing page
  redirect('/polls');
}

/**
 * Updates an existing poll with new data.
 * 
 * This Server Action handles poll modification:
 * 1. Authenticates the user
 * 2. Validates ownership (users can only update their own polls)
 * 3. Updates poll data in the database
 * 4. Revalidates cached data
 * 
 * @param {string} pollId - The unique identifier of the poll to update
 * @param {Partial<CreatePollData>} data - Partial poll data to update
 * @returns {Promise<ActionResult>} Result object with success status and data/error
 * @throws {Error} When database operations fail
 */
export async function updatePollAction(pollId: string, data: Partial<CreatePollData>): Promise<ActionResult> {
  try {
    // Step 1: Initialize Supabase client for server-side operations
    const supabase = supabaseServer();
    
    // Step 2: Authenticate user - only authenticated users can update polls
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to update a poll' };
    }

    // Step 3: Update poll data (updatePoll function handles ownership validation)
    const poll = await updatePoll(pollId, {
      title: data.title,
      description: data.description,
      options: data.options
    });

    // Step 4: Validate update success
    if (!poll) {
      return { success: false, error: 'Failed to update poll or poll not found' };
    }

    // Step 5: Invalidate cached polls data to reflect changes
    revalidatePath('/polls');
    revalidatePath(`/polls/${pollId}`);
    return { success: true, data: poll };
  } catch (error) {
    console.error('Error updating poll:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Deletes an existing poll permanently.
 * 
 * This Server Action handles poll deletion:
 * 1. Authenticates the user
 * 2. Validates ownership (users can only delete their own polls)
 * 3. Removes poll and associated data from database
 * 4. Revalidates cached data
 * 
 * Note: This operation is irreversible and will also delete:
 * - All poll options
 * - All votes cast on the poll
 * - Any associated metadata
 * 
 * @param {string} pollId - The unique identifier of the poll to delete
 * @returns {Promise<ActionResult>} Result object with success status and error if applicable
 * @throws {Error} When database operations fail
 */
export async function deletePollAction(pollId: string): Promise<ActionResult> {
  try {
    // Step 1: Initialize Supabase client for server-side operations
    const supabase = supabaseServer();
    
    // Step 2: Authenticate user - only authenticated users can delete polls
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to delete a poll' };
    }

    // Step 3: Delete poll (pollsDb.deletePoll handles ownership validation)
    const success = await deletePoll(pollId, user.id);

    // Step 4: Validate deletion success
    if (!success) {
      return { success: false, error: 'Failed to delete poll or poll not found' };
    }

    // Step 5: Invalidate cached polls data to reflect deletion
    revalidatePath('/polls');
    return { success: true };
  } catch (error) {
    // Error handling - Log and return structured error response
    console.error('Error deleting poll:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Alternative vote casting action with direct parameters (non-form based).
 * 
 * This version of castVoteAction:
 * - Takes pollId and optionId as direct parameters
 * - Requires user authentication (no anonymous voting)
 * - Uses direct Supabase client calls instead of abstracted functions
 * - Returns structured ActionResult instead of throwing errors
 * 
 * Note: This appears to be a duplicate of the form-based castVoteAction above.
 * Consider consolidating these functions to avoid confusion.
 * 
 * @param {string} pollId - The unique identifier of the poll
 * @param {string} optionId - The unique identifier of the poll option
 * @returns {Promise<ActionResult>} Result object with success status and error if applicable
 * @throws {Error} When database operations fail
 */
export async function castVoteAction(pollId: string, optionId: string): Promise<ActionResult> {
  try {
    const supabase = supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to vote' };
    }

    const { data: vote } = await supabase.from('votes').insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: user.id
    });

    if (!vote) {
      return { success: false, error: 'Failed to cast vote' };
    }

    revalidatePath(`/polls/${pollId}`);
    return { success: true, data: vote };
  } catch (error) {
    console.error('Error casting vote:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Cast vote from form data
export async function castVoteFormAction(formData: FormData) {
  const pollId = formData.get('pollId') as string;
  const optionId = formData.get('optionId') as string;

  const result = await castVoteAction(pollId, optionId);

  if (!result.success) {
    throw new Error(result.error || 'Failed to cast vote');
  }
}

// Authentication actions (placeholders)
export async function signInAction(formData: FormData) {
  // TODO: Implement sign in logic
  throw new Error('Sign in not implemented yet');
}

export async function signUpAction(formData: FormData) {
  // TODO: Implement sign up logic
  throw new Error('Sign up not implemented yet');
}

export async function signOutAction() {
  // TODO: Implement sign out logic
  throw new Error('Sign out not implemented yet');
}