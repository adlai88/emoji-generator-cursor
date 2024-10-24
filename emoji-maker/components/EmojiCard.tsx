import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, Heart } from 'lucide-react';

interface EmojiCardProps {
  id: number;
  src: string;
  alt: string;
  currentLikes: number;
  onLike: (id: number, liked: boolean) => Promise<number>;
}

export function EmojiCard({ id, src, alt, currentLikes, onLike }: EmojiCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(currentLikes);
  const [isHeartHovered, setIsHeartHovered] = useState(false);

  useEffect(() => {
    const likedImages = JSON.parse(localStorage.getItem('likedImages') || '{}');
    setIsLiked(!!likedImages[id]);
    setLikeCount(currentLikes);
    console.log(`Emoji ${id} current likes:`, currentLikes); // Add this line
  }, [id, currentLikes]);

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    
    // Optimistically update UI
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    
    try {
      const updatedLikeCount = await onLike(id, newIsLiked);
      setLikeCount(updatedLikeCount); // Update with the count from the server
      
      // Update local storage
      const likedImages = JSON.parse(localStorage.getItem('likedImages') || '{}');
      if (newIsLiked) {
        likedImages[id] = true;
      } else {
        delete likedImages[id];
      }
      localStorage.setItem('likedImages', JSON.stringify(likedImages));
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert UI if the server request fails
      setIsLiked(!newIsLiked);
      setLikeCount(likeCount);
    }
  };

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
