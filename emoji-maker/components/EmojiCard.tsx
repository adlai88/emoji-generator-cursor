import Image from 'next/image';
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, Heart } from 'lucide-react';

interface EmojiCardProps {
  src: string;
  alt: string;
}

export function EmojiCard({ src, alt }: EmojiCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = () => {
    // Implement download functionality
    window.open(src, '_blank');
  };

  const handleLike = () => {
    // Implement like functionality
    console.log('Liked emoji:', src);
  };

  return (
    <Card 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image src={src} alt={alt} width={256} height={256} className="w-full h-auto" />
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white hover:text-primary hover:bg-white"
            onClick={handleDownload}
          >
            <Download className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-primary hover:bg-white"
            onClick={handleLike}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>
      )}
    </Card>
  );
}
