'use client';

import { useState, useEffect } from "react";
import EmojiForm from "@/components/emoji-form";
import { EmojiGrid } from "@/components/EmojiGrid";
import { useAuth } from "@clerk/nextjs";

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
    }
  }, [isLoaded, userId]);

  const fetchEmojis = async () => {
    try {
      const response = await fetch('/api/get-all-emojis');
      const data = await response.json();
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
          <EmojiGrid emojis={emojis} />
        </>
      ) : (
        <p>Please sign in to use the Emoji Maker.</p>
      )}
    </main>
  );
}
