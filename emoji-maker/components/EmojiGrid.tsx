import Image from 'next/image';
import { Card } from './ui/card';

interface EmojiGridProps {
  emojis: string[];
}

export function EmojiGrid({ emojis }: EmojiGridProps) {
  console.log('Emojis to render:', emojis);
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {emojis && emojis.length > 0 ? (
        emojis.map((emoji, index) => (
          <Card key={index} className="p-4 flex items-center justify-center">
            <div className="relative w-32 h-32">
              <Image
                src={emoji}
                alt={`Generated emoji ${index + 1}`}
                layout="fill"
                objectFit="contain"
              />
            </div>
          </Card>
        ))
      ) : (
        <div>No emojis to display</div>
      )}
    </div>
  );
}
