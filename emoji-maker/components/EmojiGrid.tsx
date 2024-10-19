import { EmojiCard } from './EmojiCard';

interface EmojiGridProps {
  emojis: string[];
}

export function EmojiGrid({ emojis }: EmojiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {emojis.map((emoji, index) => (
        <EmojiCard key={index} src={emoji} alt={`Generated Emoji ${index + 1}`} />
      ))}
    </div>
  );
}
