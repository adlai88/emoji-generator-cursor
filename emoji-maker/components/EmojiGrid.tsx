import Image from 'next/image';
import { Card } from './ui/card';

interface EmojiGridProps {
  emojis: string[];
}

export function EmojiGrid({ emojis }: EmojiGridProps) {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {emojis.map((emoji, index) => (
        <Card key={index} className="p-0 overflow-hidden aspect-square">
          <div className="relative w-full h-full">
            <Image
              src={emoji}
              alt={`Generated emoji ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
