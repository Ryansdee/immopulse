import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import PropertyCarousel from './PropertyCarousel';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './css/PropertyDetails.css';


function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3030/api/properties/${id}`)
      .then(response => {
        setProperty(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de la propriété :', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (property && property.latitude && property.longitude) {
      const map = L.map('map', { center: [property.latitude, property.longitude], zoom: 15 });

      const customIcon = L.icon({
        iconUrl: `/img/${id}/image1.jpg`, // Ton image personnalisée pour le marqueur
        iconSize: [80, 80], // Taille de l'icône
        iconAnchor: [20, 40], // Ancre pour que l'icône pointe correctement
        popupAnchor: [0, -40], // Positionnement du popup par rapport à l'icône
      });

      // Ajouter une couche de tuiles OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Ajouter un marqueur sur la carte
      L.marker([property.latitude, property.longitude], { icon: customIcon }).addTo(map)
        .bindPopup(`<strong>${property.title}</strong><br>${property.description}`)
        .openPopup();
    }
  }, [property]);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500 text-lg">Chargement...</div>;
  }

  if (!property) {
    return <div className="text-center mt-20 text-red-500 text-lg">Propriété non trouvée</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100" style={{ paddingTop: '50px' }}>
      {/* Header - Image de couverture et titre */}
      {property.image_url && (
        <div className="w-full h-[500px] relative">
          <img
            src={`/img/${property.id}/image1.jpg`}
            alt="Propriété"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg text-center px-4">
              {property.title}
            </h1>
          </div>
        </div>
      )}

      {/* Détails du bien */}
      <main className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl mt-16 mb-16 p-10 space-y-10">
        {/* Titre & Prix */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-3xl font-bold text-gray-900">{property.title}</h2>
          <p className="text-2xl font-semibold text-green-600 mt-4 md:mt-0">{property.price} €</p>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-gray-300 pl-4 italic">
          {property.description}
        </p>

        {/* Carousel */}
        <PropertyCarousel propertyId={property.id} />

        {/* Informations principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800">
          <InfoCard label="Localisation" value={`${property.city} ${property.postal_code}, ${property.region}`} />
          <InfoCard label="Type de bien" value={property.type} />
          <InfoCard label="Surface" value={`${property.surface} m²`} />
          <InfoCard label="Chambres" value={property.rooms} />
          <InfoCard label="Salles de bain" value={property.bathrooms} />
        </div>

        {/* Section de Performance énergétique */}
        <div className="bg-gray-50 rounded-lg p-6 mt-10 shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-800">Performance énergétique</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mt-4">
            <div className="flex justify-between">
              <span>Consommation énergétique</span>
              <span>{property.energy_consumption} kWh/m²</span>
            </div>
            <div className="flex justify-between">
              <span>Emissions CO2</span>
              <span>{property.co2_emissions} kgCO2/m²</span>
            </div>
          </div>
        </div>

        {/* Localisation sur une carte */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Localisation</h3>
          <div id="map" className="h-80 bg-gray-200 rounded-lg"></div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border">
      <h3 className="text-sm font-semibold text-gray-500 uppercase">{label}</h3>
      <p className="text-lg font-medium text-gray-900">{value}</p>
    </div>
  );
}

export default PropertyDetails;
