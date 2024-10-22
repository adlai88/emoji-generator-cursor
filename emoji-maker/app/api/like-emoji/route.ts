import { NextRequest, NextResponse } from 'next/server';
import { supabase, getUser } from '@/lib/clients';

export async function POST(req: NextRequest) {
  const userId = await getUser();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { emojiId, liked } = await req.json();

  if (typeof emojiId !== 'number' || typeof liked !== 'boolean') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // Call the updated Supabase function
  const { data, error } = await supabase.rpc('toggle_emoji_like', {
    p_user_id: userId,
    p_emoji_id: emojiId,
    p_liked: liked
  });

  if (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Error updating like status' }, { status: 500 });
  }

  // The function now returns an array with one object
  const updatedLikesCount = data[0].likes_count;

  return NextResponse.json({ success: true, likesCount: updatedLikesCount });
}
