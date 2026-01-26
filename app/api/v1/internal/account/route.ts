// app/api/account/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    // Validate user and get user id (this makes a request to Auth server)
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const userId = userData.user.id

    // Query accounts table — relies on RLS to ensure user can only read their own row
    const { data, error } = await supabase
      .from('accounts')
      .select('id, display_name')
      .eq('id', userId)
      .limit(1)
      .single()

    if (error) {
      // If RLS denies access, error will explain; surface as 403/404 appropriately
      const status = error.details?.includes('permission') ? 403 : 404
      return NextResponse.json({ error: error.message }, { status })
    }

    return NextResponse.json({ account: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 })
  }
}