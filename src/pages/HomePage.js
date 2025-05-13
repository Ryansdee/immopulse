// src/pages/HomePage.js
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import Footer from '../components/Footer'; // Assurez-vous que le chemin est correct
import './css/HomePage.css'; // Assurez-vous que le chemin est correct


const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);


    const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
  
  const AnimatedCounter = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.3,
    });
    
    const countRef = useRef(0);
    const rafRef = useRef(null);
    
    useEffect(() => {
      if (inView) {
        const startTime = performance.now();
        const finalValue = parseInt(value.replace(/,/g, ''), 10);
        
        const updateCount = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          // Easing function (ease-out)
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          
          const currentCount = Math.floor(easedProgress * finalValue);
          
          if (countRef.current !== currentCount) {
            countRef.current = currentCount;
            setCount(currentCount);
          }
          
          if (progress < 1) {
            rafRef.current = requestAnimationFrame(updateCount);
          }
        };
        
        rafRef.current = requestAnimationFrame(updateCount);
        
        return () => {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
          }
        };
      }
    }, [inView, value, duration]);
    
    // Formatage du nombre avec des séparateurs de milliers
    const formattedCount = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return <div ref={ref}>{formattedCount}</div>;
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Déclaration de l'état pour les propriétés
  const [properties, setProperties] = useState([]);  

  // Récupérer les propriétés depuis l'API
  useEffect(() => {
    axios.get('http://localhost:3030/api/properties-feature')
      .then(response => {
        setProperties(response.data);  // Mettre à jour les propriétés
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des propriétés:', error);
      });
  }, []);
  
  const PropertyCarousel = ({ propertyId }) => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      axios.get(`http://localhost:3030/api/property-images/${propertyId}`)
        .then(response => {
          setImages(response.data.slice(0, 3)); // Récupérer les 3 premières images
        })
        .catch(error => {
          console.error('Erreur lors du chargement des images:', error);
        });
    }, [propertyId]);
  
    const goToPrevious = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };
  
    const goToNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };
  
    return (
     <div className="relative">
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {/* Dynamique de l'image avec image + index */}
              <img
                src={`${image.replace(/image\d+\.jpg/, `image${index + 1}.jpg`)}`} // Ajouter 1 pour l'image suivante
                alt={`Property Image ${index + 1}`}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
      >
        &lt;
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
      >
        &gt;
      </button>
    </div>
    );
  };
  

  const features = [
    {
      title: "Recherche intelligente",
      description: "Filtres avancés pour trouver exactement ce que vous cherchez",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      title: "Comparaison de prix",
      description: "Analysez le marché immobilier avec des données en temps réel",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      title: "Contact direct",
      description: "Communiquez directement avec les vendeurs et agents",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  const stats = [
    { value: "10,000+", label: "Propriétés disponibles" },
    { value: "98%", label: "Clients satisfaits" },
    { value: "24/7", label: "Support client" },
    { value: "200+", label: "Agents partenaires" }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className={`relative overflow-hidden transition-opacity duration-500`}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/90 mix-blend-multiply" />
          <img 
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Modern house exterior" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                Trouvez <span className="text-white" style={{textDecoration: "underline"}}>la maison</span> de vos rêves en Belgique
              </h1>
              <p className="mt-6 text-xl sm:text-2xl text-blue-100">
                Une recherche immobilière intelligente, intuitive et personnalisée
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/search" 
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg text-lg text-center hover:cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
              >
                Commencer votre recherche <br />
                Juste ici en bas
              </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de bien</label>
                <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option>Tous les types</option>
                  <option>Appartement</option>
                  <option>Maison</option>
                  <option>Villa</option>
                  <option>Terrain</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option>Toute la Belgique</option>
                  <option>Bruxelles</option>
                  <option>Anvers</option>
                  <option>Gand</option>
                  <option>Charleroi</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget max</label>
                <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option>Tous les prix</option>
                  <option>€100,000</option>
                  <option>€250,000</option>
                  <option>€500,000</option>
                  <option>€750,000+</option>
                </select>
              </div>
              <div className="md:col-span-1 flex items-end">
                <Link 
                  to="/search" 
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Rechercher
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50 text-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900" id="search">Propriétés à la une</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos meilleures propriétés sélectionnées pour leur qualité exceptionnelle et leur excellent rapport qualité-prix
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
  <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <PropertyCarousel propertyId={property.id} />
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
          <p className="text-gray-600 flex items-center mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.city} {property.postal_code}, {property.region}
          </p>
        </div>
        <span className="font-bold text-xl text-blue-600">{formatPrice(property.price)} €</span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-4">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          {property.rooms} chambres
        </span>
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5m14-4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {property.bathrooms} salle{property.bathrooms > 1 ? 's' : ''} de bain
        </span>
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {property.surface} m²
        </span>
      </div>
      <Link
        to={`/property/${property.id}`}
        className="mt-5 block text-center py-2 px-4 bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md transition-colors duration-300"
      >
        Voir les détails
      </Link>
    </div>
  </div>
))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/search" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              Voir toutes les propriétés
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>


      {/* Statistics Section */}
    <section className="py-16 bg-blue-700 text-white overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`p-4 transform transition-all duration-700 ease-out ${
                inView 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-16 opacity-0'
              }`} 
              style={{ 
                transitionDelay: `${index * 150}ms` 
              }}
            >
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-blue-200 transform transition-all duration-500" 
                style={{ 
                  transitionDelay: `${(index * 150) + 300}ms`,
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(10px)'
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* CTA Section */}
      <section className="py-16 backgroundimg text-black">
        <div className="container mx-auto text-black px-4 text-center z-1">
          <h2 className="text-3xl font-bold text-black mb-6 mx-auto">Prêt à trouver votre maison de rêve ?</h2>
          <p className="text-xl text-gray-800 text-black mb-8 mx-auto">
            Inscrivez-vous dès aujourd'hui et commencez votre recherche immobilière avec ImmoPulse
            </p>
            <Link to="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 transition-colors duration-300">
              Créer un compte gratuit
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default HomePage;