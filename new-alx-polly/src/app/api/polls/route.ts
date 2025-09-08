
import { NextResponse } from 'next/server'
import { createPoll } from '@/lib/supabase/db'
import { getCurrentUser } from '@/lib/supabase/client'
import { CreatePollForm } from '@/lib/supabase/database.types'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to create a poll' }, { status: 401 })
    }

    const { title, options } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Poll title is required' }, { status: 400 })
    }

    if (options.length < 2) {
      return NextResponse.json({ error: 'At least 2 options are required' }, { status: 400 })
    }

    if (options.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 options allowed' }, { status: 400 })
    }

    const pollData: CreatePollForm = {
      title: title.trim(),
      options
    }

    const result = await createPoll(pollData, user.id)

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Error creating poll:', error)
    return NextResponse.json({ error: error.message || 'Failed to create poll' }, { status: 500 })
  }
}
