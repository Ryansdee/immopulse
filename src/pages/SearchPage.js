import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer'; // Assurez-vous que le chemin est correct
import { Link } from "react-router-dom";
import axios from 'axios'; // Importez axios pour effectuer des requêtes HTTP
import PropertyCarousel from './PropertyCarousel';

const SearchPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState("Toute la Belgique");
  const [propertyType, setPropertyType] = useState("Tous les types");
  const [budget, setBudget] = useState("Tous les prix");

  // Utilisation de useEffect pour récupérer les propriétés depuis votre backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:3030/api/properties');
        setProperties(response.data); // Supposons que votre API renvoie un tableau d'objets de propriétés
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des propriétés:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []); // Utilisez un tableau vide pour appeler cette fonction une seule fois au montage du composant

  // Filtrer les propriétés par localisation, type et budget
  const filteredProperties = properties.filter(property => {
    const locationMatch = locationFilter === "Toute la Belgique" || property.location.includes(locationFilter);
    const typeMatch = propertyType === "Tous les types" || property.type.includes(propertyType);

    const priceString = property.price.toString();  // Assurez-vous que c'est une chaîne
    const price = parseInt(priceString.replace(/[^\d]/g, ''));  // Enlevez tout ce qui n'est pas un chiffre
    const budgetValue = budget === "Tous les prix" ? Infinity : parseInt(budget.replace(/[^\d]/g, '')); // Même traitement pour le budget
    const priceMatch = price <= budgetValue;

    return locationMatch && typeMatch && priceMatch;
  });

  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
  };

  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };

  const handleBudgetChange = (e) => {
    setBudget(e.target.value);
  };

  const SearchSection = () => {
    return (
      <section>
        <div className="container mx-auto px-4" style={{ paddingTop: '100px' }}>
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de bien</label>
                <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  onChange={handlePropertyTypeChange}
                  value={propertyType}
                >
                  <option>Tous les types</option>
                  <option>Appartement</option>
                  <option>Maison</option>
                  <option>Villa</option>
                  <option>Terrain</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleLocationChange}
                  value={locationFilter}
                >
                  <option>Toute la Belgique</option>
                  <option>Bruxelles</option>
                  <option>Anvers</option>
                  <option>Gand</option>
                  <option>Charleroi</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget max</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleBudgetChange}
                  value={budget}
                >
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
    );
  };

  const FeaturedProperties = () => {
    if (loading) {
      return <div>Chargement...</div>;
    }

    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Propriétés à la une</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos meilleures propriétés sélectionnées pour leur qualité exceptionnelle et leur excellent rapport qualité-prix
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <span className={`absolute top-4 left-4 bg-${property.tag === 'Nouveau' ? 'blue' : property.tag === 'Populaire' ? 'green' : 'orange'}-600 text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {property.tag}
                  </span>
                  <PropertyCarousel propertyId={property.id} />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
                      <p className="text-gray-600 flex items-center mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.242-4.243a2 2 0 010-2.828l4.242-4.242a1.998 1.998 0 012.828 0l4.243 4.242a2 2 0 010 2.828z" />
                        </svg>
                        {property.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xl text-blue-600 font-semibold">{property.price} €</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div>
      <SearchSection />
      <FeaturedProperties />
      <Footer />
    </div>
  );
};

export default SearchPage;
