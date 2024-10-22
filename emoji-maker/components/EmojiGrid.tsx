import { EmojiCard } from './EmojiCard';

interface Emoji {
  id: number;
  image_url: string;
  likes_count: number;
}

interface EmojiGridProps {
  emojis: Emoji[];
  onLike: (id: number, liked: boolean) => Promise<void>;
}

export function EmojiGrid({ emojis, onLike }: EmojiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {emojis.map((emoji) => (
        <EmojiCard
          key={emoji.id}
          id={emoji.id}
          src={emoji.image_url}
          alt={`Emoji ${emoji.id}`}
          initialLikes={emoji.likes_count}
          onLike={onLike}
        />
      ))}
    </div>
  );
}
