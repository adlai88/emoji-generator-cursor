'use client';

import { useState, useEffect } from "react";
import EmojiForm from "@/components/emoji-form";
import { EmojiGrid } from "@/components/EmojiGrid";
import { useAuth } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface Emoji {
  id: number;
  image_url: string;
  likes_count: number;
}

export default function Home() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      fetchEmojis();
      const unsubscribe = subscribeToEmojiChanges();
      return () => {
        unsubscribe();
      };
    }
  }, [isLoaded, userId]);

  const fetchEmojis = async () => {
    try {
      const response = await fetch(`/api/get-all-emojis?t=${Date.now()}`);
      const data = await response.json();
      console.log('Fetched emojis:', data);
      if (data.emojis) {
        setEmojis(data.emojis);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error fetching emojis:', error);
      setError('Failed to fetch emojis');
    }
  };

  const subscribeToEmojiChanges = () => {
    console.log('Attempting to subscribe to emoji changes');
    const channel = supabase
      .channel('emoji_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'emojis' },
        (payload) => {
          console.log('New emoji received:', payload.new);
          setEmojis(prevEmojis => [payload.new as Emoji, ...prevEmojis]);
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'emojis' },
        (payload) => {
          console.log('Emoji updated:', payload.new);
          setEmojis(prevEmojis => prevEmojis.map(emoji => 
            emoji.id === payload.new.id ? { ...emoji, ...payload.new as Emoji } : emoji
          ));
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Unsubscribing from emoji changes');
      supabase.removeChannel(channel);
    };
  };

  const handleEmojiGenerated = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-and-upload-emoji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (data.emoji) {
        setEmojis(prevEmojis => [data.emoji, ...prevEmojis]);
      } else if (data.error) {
        setError(`${data.error}`);
      } else {
        setError('No emoji generated');
      }
    } catch (error) {
      console.error('Error generating emoji:', error);
      setError('Failed to generate emoji');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (emojiId: number, liked: boolean) => {
    try {
      const response = await fetch('/api/like-emoji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emojiId, liked })
      });
      const data = await response.json();
      console.log('Server response:', data);
      if (data.error) {
        throw new Error(data.error);
      }
      // Update the emojis state with the new likes count from the server
      setEmojis(prevEmojis =>
        prevEmojis.map(emoji =>
          emoji.id === emojiId
            ? { ...emoji, likes_count: data.likesCount }
            : emoji
        )
      );
      console.log('Emojis after update:', emojis); // Add this line
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">Emoji Maker</h1>
      {userId ? (
        <>
          <EmojiForm onSubmit={handleEmojiGenerated} isLoading={isLoading} />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <EmojiGrid emojis={emojis} onLike={handleLike} />
        </>
      ) : (
        <p>Please sign in to use the Emoji Maker.</p>
      )}
    </main>
  );
}
