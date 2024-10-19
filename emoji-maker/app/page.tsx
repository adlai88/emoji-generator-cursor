'use client';

import { useState } from "react";
import EmojiForm from "@/components/emoji-form";
import { EmojiGrid } from "@/components/EmojiGrid";
import EmojiCard from '../components/EmojiCard';

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
      console.log('Received data from server:', data);
      if (data.urls && data.urls.length > 0) {
        setEmojis(prevEmojis => [...data.urls, ...prevEmojis]);
      } else if (data.error) {
        setError(`${data.error}${data.details ? ': ' + data.details : ''}`);
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

  const handleLike = (imageUrl: string) => {
    // Implement like functionality
    console.log('Liked:', imageUrl);
  };

  const handleDownload = (imageUrl: string) => {
    // Implement download functionality
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'emoji.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">Emoji Maker</h1>
      <EmojiForm onSubmit={handleEmojiGenerated} isLoading={isLoading} />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <EmojiGrid emojis={emojis} />
    </main>
  );
}
