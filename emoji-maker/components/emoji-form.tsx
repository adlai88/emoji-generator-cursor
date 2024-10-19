import { useState } from "react";
import { Button } from './ui/button';
import { Input } from './ui/input';

interface EmojiFormProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export default function EmojiForm({ onSubmit, isLoading }: EmojiFormProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter emoji description"
        className="flex-grow text-black placeholder-gray-500 bg-white"
        style={{ color: 'black' }} // Inline style for stronger override
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate"}
      </Button>
    </form>
  );
}
