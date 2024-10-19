'use client';

import { useState } from "react";
import EmojiForm from "@/components/emoji-form";
import { EmojiGrid } from "@/components/EmojiGrid";

export default function Home() {
  const [emojis, setEmojis] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmojiGenerated = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-emoji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (data.urls && data.urls.length > 0) {
        setEmojis(prevEmojis => [...data.urls, ...prevEmojis]);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('No emoji URLs received');
      }
    } catch (error) {
      console.error('Error generating emoji:', error);
      setError('Failed to generate emoji');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">😎 Emoj maker</h1>
        <EmojiForm onEmojiGenerated={handleEmojiGenerated} isLoading={isLoading} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <EmojiGrid emojis={emojis} />
      </main>
    </div>
  );
}
