
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!images.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden aspect-video">
        <img
          src={images[currentImageIndex]}
          alt={`${title} - Imagen ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
              onClick={handlePrevious}
            >
              <ChevronLeft size={24} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
              onClick={handleNext}
            >
              <ChevronRight size={24} />
            </Button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="bg-black/30 rounded-full px-4 py-1">
                {images.length > 1 && (
                  <span className="text-white text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                index === currentImageIndex
                  ? 'border-homi-purple'
                  : 'border-transparent'
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
