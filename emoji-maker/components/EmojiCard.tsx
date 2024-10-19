import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, Heart } from 'lucide-react';

interface EmojiCardProps {
  imageUrl: string;
  onLike: () => void;
  onDownload: () => void;
}

const EmojiCard: React.FC<EmojiCardProps> = ({ imageUrl, onLike, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={imageUrl} alt="Emoji" className="w-full h-full object-cover" />
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={onDownload}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onLike}
            title="Like"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EmojiCard;
