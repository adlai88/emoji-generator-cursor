import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, Heart } from 'lucide-react';

interface EmojiCardProps {
  id: number;
  src: string;
  alt: string;
  initialLikes: number;
  onLike: (id: number, liked: boolean) => Promise<void>;
}

export function EmojiCard({ id, src, alt, initialLikes, onLike }: EmojiCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isHeartHovered, setIsHeartHovered] = useState(false);

  useEffect(() => {
    // Check if the image is liked in local storage
    const likedImages = JSON.parse(localStorage.getItem('likedImages') || '{}');
    setIsLiked(!!likedImages[id]);
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `emoji-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);

    // Update local storage
    const likedImages = JSON.parse(localStorage.getItem('likedImages') || '{}');
    if (newLikedState) {
      likedImages[id] = true;
    } else {
      delete likedImages[id];
    }
    localStorage.setItem('likedImages', JSON.stringify(likedImages));

    // Call the onLike function to update the backend
    try {
      await onLike(id, newLikedState);
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert the like state if the API call fails
      setIsLiked(!newLikedState);
      setLikeCount(prevCount => newLikedState ? prevCount - 1 : prevCount + 1);
    }
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
            className={`text-white hover:bg-white ${isLiked ? 'hover:text-black' : 'hover:text-red-500'}`}
            onClick={handleLike}
            onMouseEnter={() => setIsHeartHovered(true)}
            onMouseLeave={() => setIsHeartHovered(false)}
          >
            <Heart 
              className={`h-6 w-6 ${
                isLiked 
                  ? isHeartHovered 
                    ? 'text-black' 
                    : 'text-white stroke-2' 
                  : isHeartHovered 
                    ? 'text-red-500 fill-current' 
                    : 'text-red-500 fill-current'
              }`} 
            />
          </Button>
        </div>
      )}
      {likeCount > 0 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </div>
      )}
    </Card>
  );
}
