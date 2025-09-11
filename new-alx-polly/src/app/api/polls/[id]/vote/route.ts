
/**
 * Vote Casting API Route - REST Endpoint for Poll Voting
 * 
 * Handles HTTP POST requests to cast votes on specific polls.
 * Supports both authenticated and anonymous voting with proper
 * validation and error handling.
 * 
 * Route: POST /api/polls/[id]/vote
 * 
 * Request Body:
 * ```json
 * {
 *   "optionId": "uuid-of-selected-option"
 * }
 * ```
 * 
 * Response (Status: 201):
 * ```json
 * {
 *   "success": true
 * }
 * ```
 * 
 * Error Response:
 * * Error Responses:
 * - 400: Invalid JSON / missing fields
 * - 409: Duplicate vote
 * - 422: Invalid request body (validation)
 * - 500: Unexpected server error
 * 
 * @param {Request} request - HTTP request object containing vote data
 * @param {Object} params - Route parameters
 * @param {string} params.id - Poll ID from URL path
 * @returns {Promise<NextResponse>} JSON response with success status or error
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { castVote } from '@/lib/supabase/db'
import { getCurrentUser } from '@/lib/supabase/client'
import { CastVoteForm } from '@/lib/supabase/database.types'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Step 1: Get current user (supports anonymous voting - userId can be null)
    const user = await getCurrentUser()
    const userId = user?.id // Optional for anonymous voting support

    // Step 2: Extract poll ID from URL parameters
    const resolvedParams = await params
    const pollId = resolvedParams.id
    
    // Step 3-4: Parse and validate request body
    let optionId: string
    try {
      const body = await request.json()
      ;({ optionId } = voteSchema.parse(body))
    } catch (e) {
      if (e instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
      }
      if (e instanceof ZodError) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 422 })
      }
      throw e
    }

    // Step 5: Prepare vote data structure for database insertion
    const voteData: CastVoteForm = {
      pollId,
      optionId
    }

    // Step 6: Cast vote using database service (handles duplicates and validation)
    await castVote(voteData, userId)

    // Step 7: Return success response
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: unknown) {
    // Error handling: Log error and return user-friendly message
    console.error('Error casting vote:', error)
    // Duplicate vote (unique constraint) → 409
    if ((error as { code?: string })?.code === '23505') {
      return NextResponse.json({ error: 'Duplicate vote' }, { status: 409 })
    }
    // Fallback for all other errors
    return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 })
  }
}
