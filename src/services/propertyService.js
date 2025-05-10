// src/services/propertyService.js
import axios from 'axios';

export const getProperties = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/properties');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des biens', error);
    throw error;  // Peut être utilisé pour gérer l'erreur dans ton composant React
  }
};
