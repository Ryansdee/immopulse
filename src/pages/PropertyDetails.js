import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import { MapPin, Home, Ruler, Bed, Bath } from 'lucide-react';
import PropertyCarousel from './PropertyCarousel';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './css/PropertyDetails.css';

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction de formatage du prix
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Charger les données du bien
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

  // Initialiser la carte Leaflet
  useEffect(() => {
    if (property && property.latitude && property.longitude) {
      const existingMap = L.DomUtil.get('map');
      if (existingMap && existingMap._leaflet_id != null) {
        existingMap._leaflet_id = null;
      }

      const map = L.map('map', { attributionControl: false }).setView([property.latitude, property.longitude], 15);

      const customIcon = L.icon({
        iconUrl: `/img/${id}/image1.jpg`,
        iconSize: [80, 80],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ImmoPulse BE'
      }).addTo(map);

      L.marker([property.latitude, property.longitude], { icon: customIcon }).addTo(map)
        .bindPopup(`<strong>${property.title}</strong><br>${property.description}`)
        .openPopup();

      return () => map.remove(); // Nettoyage à la destruction
    }
  }, [property, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <span className="animate-pulse text-lg">Chargement...</span>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">
        Propriété non trouvée
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Image de couverture */}
      {property.image_url && (
        <div className="relative w-full h-[500px]">
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

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl mt-12 mb-16 px-8 py-10 space-y-10">
        {/* Titre & prix */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-3xl font-semibold text-gray-900">{property.title}</h2>
          <p className="text-2xl font-bold text-green-600">{formatPrice(property.price)} €</p>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-blue-500/40 pl-4 italic">
          {property.description}
        </p>

        {/* Carousel */}
        <PropertyCarousel propertyId={property.id} />

        {/* Infos principales */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Caractéristiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800">
            <InfoCard label="Localisation" value={`${property.city} ${property.postal_code}, ${property.region}`} Icon={MapPin} />
            <InfoCard label="Type de bien" value={property.type} Icon={Home} />
            <InfoCard label="Surface" value={`${property.surface} m²`} Icon={Ruler} />
            <InfoCard label="Chambres" value={property.rooms} Icon={Bed} />
            <InfoCard label="Salles de bain" value={property.bathrooms} Icon={Bath} />
          </div>
        </section>

        {/* Énergie */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance énergétique</h3>
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Consommation énergétique</span>
              <span>{property.energy_consumption} kWh/m²</span>
            </div>
            <div className="flex justify-between">
              <span>Émissions CO₂</span>
              <span>{property.co2_emissions} kgCO₂/m²</span>
            </div>
          </div>
        </section>

        {/* Carte */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Localisation sur carte</h3>
          <div id="map" className="h-80 bg-gray-200 rounded-lg shadow-inner" style={{ zIndex: 0 }}></div>
          <div className="small" style={{paddingTop: 18, fontSize: 11, fontStyle: "italic"}}>*La carte ne s’enregistre pas pour garder la performance.</div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function InfoCard({ label, value, Icon }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 shadow-sm border flex items-start gap-4 hover:shadow-md transition-shadow duration-300">
      {Icon && <Icon className="w-6 h-6 text-blue-600 mt-1 shrink-0" />}
      <div>
        <h4 className="text-sm font-semibold text-gray-500 uppercase">{label}</h4>
        <p className="text-lg font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default PropertyDetails;
  