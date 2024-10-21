import { NextResponse } from 'next/server';
import { supabase, getUser } from '@/lib/clients';

export async function POST() {
  const userId = await getUser();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user exists in profiles table
  const { data: existingUser, error: fetchError } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user:', fetchError);
    return NextResponse.json({ error: 'Error checking user existence' }, { status: 500 });
  }

  if (!existingUser) {
    // User doesn't exist, create new profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ user_id: userId });

    if (insertError) {
      console.error('Error creating user:', insertError);
      return NextResponse.json({ error: 'Error creating user profile' }, { status: 500 });
    }
  }

  return NextResponse.json({ userId });
}
