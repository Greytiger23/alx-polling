
import { NextResponse } from 'next/server'
import { castVote } from '@/lib/supabase/db'
import { getCurrentUser } from '@/lib/supabase/client'
import { CastVoteForm } from '@/lib/supabase/database.types'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    const userId = user?.id

    const pollId = params.id
    const { optionId } = await request.json()

    if (!optionId) {
      return NextResponse.json({ error: 'Option ID is required' }, { status: 400 })
    }

    const voteData: CastVoteForm = {
      pollId,
      optionId
    }

    await castVote(voteData, userId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error casting vote:', error)
    return NextResponse.json({ error: error.message || 'Failed to cast vote' }, { status: 500 })
  }
}
