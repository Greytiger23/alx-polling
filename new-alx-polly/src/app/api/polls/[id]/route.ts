
import { NextResponse } from 'next/server'
import { updatePoll, deletePoll } from '@/lib/supabase/db'
import { getCurrentUser } from '@/lib/supabase/client'
import { PollUpdate } from '@/lib/supabase/database.types'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to update a poll' }, { status: 401 })
    }

    const resolvedParams = await params
    const pollId = resolvedParams.id
    const pollData: PollUpdate = await request.json()

    const result = await updatePoll(pollId, pollData, user.id)

    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('Error updating poll:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update poll' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to delete a poll' }, { status: 401 })
    }

    const resolvedParams = await params
    const pollId = resolvedParams.id
    await deletePoll(pollId, user.id)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting poll:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete poll'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
