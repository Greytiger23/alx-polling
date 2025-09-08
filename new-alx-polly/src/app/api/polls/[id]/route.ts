
import { NextResponse } from 'next/server'
import { updatePoll, deletePoll } from '@/lib/supabase/db'
import { getCurrentUser } from '@/lib/supabase/client'
import { PollUpdate } from '@/lib/supabase/database.types'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to update a poll' }, { status: 401 })
    }

    const pollId = params.id
    const pollData: PollUpdate = await request.json()

    const result = await updatePoll(pollId, pollData)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error updating poll:', error)
    return NextResponse.json({ error: error.message || 'Failed to update poll' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to delete a poll' }, { status: 401 })
    }

    const pollId = params.id
    await deletePoll(pollId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting poll:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete poll' }, { status: 500 })
  }
}
