'use client';

import { useState } from "react";
import EmojiForm from "@/components/emoji-form";
import { EmojiGrid } from "@/components/EmojiGrid";
import EmojiCard from '../components/EmojiCard';
import { Download, Heart } from 'lucide-react';

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
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-3xl font-bold mb-8 text-center">😎 Emoj maker</h1>
        <EmojiForm onEmojiGenerated={handleEmojiGenerated} isLoading={isLoading} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {emojis.map((imageUrl, index) => (
            <EmojiCard
              key={index}
              imageUrl={imageUrl}
              onLike={() => handleLike(imageUrl)}
              onDownload={() => handleDownload(imageUrl)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
