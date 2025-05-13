import { useState, useEffect } from 'react';
import axios from 'axios';

function PropertyCarousel({ propertyId }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:3030/api/property-images/${propertyId}`)
      .then(response => {
        setImages(response.data.slice(0, 5)); // Limiter à 5 images pour plus de variété
      })
      .catch(error => {
        console.error('Erreur lors du chargement des images:', error);
      });
  }, [propertyId]);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  if (images.length === 0) return null;

  return (
    <div className="relative mt-8 rounded-lg overflow-hidden group">
      {/* Carousel images with smooth transition */}
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover transition-all ease-in-out"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 p-3 rounded-full focus:outline-none transition-all duration-300 ease-in-out"
      >
        &lt;
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 p-3 rounded-full focus:outline-none transition-all duration-300 ease-in-out"
      >
        &gt;
      </button>

      {/* Dot Navigation (optional) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full bg-white cursor-pointer transition-all duration-300 ${index === currentIndex ? 'bg-opacity-80' : 'bg-opacity-50'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PropertyCarousel;
