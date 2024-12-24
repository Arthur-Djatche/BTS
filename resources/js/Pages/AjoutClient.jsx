import Layout from "@/Layouts/Layout";
import React, {useState} from "react";
function AjoutClient() {

    // État pour les valeurs du formulaire
  const [client, setClient] = useState("");
  const [clothingCount, setClothingCount] = useState(0);
  const [clothingDetails, setClothingDetails] = useState([]);

  // Liste de clients fictifs pour la sélection
  const clients = ["Alice", "Bob", "Charlie"]; // À remplacer par les données réelles

  // Fonction pour gérer le changement du nombre de vêtements
  const handleClothingCountChange = (e) => {
    const count = parseInt(e.target.value);
    setClothingCount(count);
    // Initialiser les détails de vêtements en fonction du nombre saisi
    setClothingDetails(Array.from({ length: count }, () => ({
      category: "",
      type: "",
      color: "#000000",
      barcode: ""
    })));
  };

  // Fonction pour gérer les modifications des sous-formulaires de chaque vêtement
  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...clothingDetails];
    updatedDetails[index][field] = value;
    setClothingDetails(updatedDetails);
  };

  // Fonction pour générer un code-barres fictif
  const generateBarcode = (index) => {
    const updatedDetails = [...clothingDetails];
    updatedDetails[index].barcode = `BC-${Math.floor(100000 + Math.random() * 900000)}`;
    setClothingDetails(updatedDetails);
  };


    return (
        <>
            <div className="p-6 bg-white rounded-md shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Ajouter un vêtement</h2>
      
      {/* Sélection du client */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Nom du client</label>
        <div className="flex">
          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mr-2 w-full"
          >
            <option value="">Sélectionner un client</option>
            {clients.map((clientName, index) => (
              <option key={index} value={clientName}>{clientName}</option>
            ))}
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Ajouter Client
          </button>
        </div>
      </div>

      {/* Nombre de vêtements */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Nombre de vêtements</label>
        <input
          type="number"
          min="0"
          value={clothingCount}
          onChange={handleClothingCountChange}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>

      {/* Sous-formulaires pour chaque vêtement */}
      {clothingDetails.map((clothing, index) => (
        <div key={index} className="mb-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Vêtement {index + 1}</h3>
          
          {/* Catégorie */}
          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Catégorie</label>
            <input
              type="text"
              value={clothing.category}
              onChange={(e) => handleDetailChange(index, 'category', e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          {/* Type */}
          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Type</label>
            <input
              type="text"
              value={clothing.type}
              onChange={(e) => handleDetailChange(index, 'type', e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          {/* Couleur */}
          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Couleur</label>
            <input
              type="color"
              value={clothing.color}
              onChange={(e) => handleDetailChange(index, 'color', e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Code-barres */}
          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Code-barres</label>
            <div className="flex items-center">
              <input
                type="text"
                value={clothing.barcode}
                readOnly
                className="border border-gray-300 rounded-md p-2 w-full mr-2"
              />
              <button
                onClick={() => generateBarcode(index)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Générer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
        </>
    );
}

AjoutClient.layout = page => <Layout children={page}/>

export default AjoutClient;