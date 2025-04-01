import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NouveauLavage = () => {
  const { clients, categories, types, consignes } = usePage().props;
  const [isMobile, setIsMobile] = useState(false);
  
  // États principaux
  const [nomClient, setNomClient] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedConsigne, setSelectedConsigne] = useState("");
  const [useKilogramme, setUseKilogramme] = useState(false);
  const [kilogrammes, setKilogrammes] = useState("");
  const [vetements, setVetements] = useState([{ 
    categorie_id: "", 
    type_id: "", 
    couleur: "#000000",
    quantite: 1 
  }]);
  
  // États pour la modale
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });

  // Détection de la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gestion des clients
  const handleClientChange = (e) => {
    const input = e.target.value;
    setNomClient(input);
    setFilteredClients(
      clients.filter(client => 
        client.nom.toLowerCase().includes(input.toLowerCase()) ||
        client.email.toLowerCase().includes(input.toLowerCase())
      )
    );
    setDropdownVisible(true);
  };

  const handleClientSelect = (client) => {
    setNomClient(`${client.nom} (${client.email})`);
    setSelectedClient(client);
    setDropdownVisible(false);
  };

  // Gestion des vêtements
  const handleVetementChange = (index, field, value) => {
    const updatedVetements = [...vetements];
    updatedVetements[index] = { ...updatedVetements[index], [field]: value };
    setVetements(updatedVetements);
  };

  const addVetement = () => {
    setVetements([...vetements, { 
      categorie_id: "", 
      type_id: "", 
      couleur: "#000000",
      quantite: 1 
    }]);
  };

  const duplicateVetement = (index) => {
    const vetementToDuplicate = vetements[index];
    setVetements([...vetements, { ...vetementToDuplicate }]);
  };

  const removeVetement = (index) => {
    if (vetements.length > 1) {
      const updatedVetements = vetements.filter((_, i) => i !== index);
      setVetements(updatedVetements);
    }
  };

  // Soumission du formulaire
  const handleSave = (e) => {
    e.preventDefault();
    
    if (!selectedClient) {
      toast.error("Veuillez sélectionner un client");
      return;
    }

    if (!selectedConsigne) {
      toast.error("Veuillez sélectionner une consigne");
      return;
    }

    const data = {
      client_id: selectedClient.id,
      vetements: vetements,
      consigne_id: selectedConsigne,
      kilogrammes: useKilogramme ? kilogrammes : null,
    };

    router.post("/receptionniste/nouveau-lavage", data, {
      onSuccess: () => toast.success("Lavage enregistré avec succès"),
      onError: (errors) => {
        console.error(errors);
        toast.error("Erreur lors de l'enregistrement");
      },
    });
  };

  // Styles réutilisables
  const inputStyle = "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const buttonStyle = "px-4 py-2 rounded text-white font-medium";
  const cardStyle = "border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm";

  return (
    <LayoutReceptionniste>
      <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl md:text-2xl font-bold text-blue-600 mb-4">Nouveau Lavage</h1>
        
        <form onSubmit={handleSave} className="space-y-4">
          {/* Recherche client */}
          <div className="relative">
            <label className="block text-blue-600 font-medium mb-1">Client</label>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-grow relative">
                <input
                  type="text"
                  className={inputStyle}
                  value={nomClient}
                  onChange={handleClientChange}
                  onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
                  onFocus={() => nomClient && setDropdownVisible(true)}
                  placeholder="Rechercher un client..."
                />
                {isDropdownVisible && filteredClients.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {filteredClients.map((client) => (
                      <li
                        key={client.id}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="font-medium">{client.nom}</div>
                        <div className="text-sm text-gray-600">{client.email}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className={`${buttonStyle} bg-blue-600 hover:bg-blue-700`}
              >
                {isMobile ? "+ Client" : "Ajouter Client"}
              </button>
            </div>
          </div>

          {/* Consigne */}
          <div>
            <label className="block text-blue-600 font-medium mb-1">Consigne de lavage</label>
            <select 
              className={inputStyle}
              value={selectedConsigne} 
              onChange={(e) => setSelectedConsigne(e.target.value)}
              required
            >
              <option value="">-- Sélectionner --</option>
              {consignes.map((consigne) => (
                <option key={consigne.id} value={consigne.id}>
                  {consigne.nom} - {consigne.type_consigne} (Priorité: {consigne.priorite_consigne})
                </option>
              ))}
            </select>
          </div>

          {/* Kilogrammage */}
          <div className={cardStyle}>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input 
                type="checkbox" 
                checked={useKilogramme} 
                onChange={() => setUseKilogramme(!useKilogramme)} 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-blue-600 font-medium">Facturer au kilogramme</span>
            </label>
            {useKilogramme && (
              <input 
                type="number" 
                min="1" 
                step="0.1"
                className={inputStyle} 
                value={kilogrammes} 
                onChange={(e) => setKilogrammes(e.target.value)} 
                placeholder="Poids en kg" 
                required
              />
            )}
          </div>

          {/* Liste des vêtements */}
          <div className="space-y-4">
            {vetements.map((vetement, index) => (
              <div key={index} className={cardStyle}>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-blue-500">
                    Vêtement {index + 1}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => duplicateVetement(index)}
                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                      Dupliquer
                    </button>
                    {vetements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVetement(index)}
                        className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-red-600"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>

                {/* Catégorie */}
                <div className="mb-3">
                  <label className="block text-blue-600 font-medium mb-1">Catégorie</label>
                  <select
                    className={inputStyle}
                    value={vetement.categorie_id}
                    onChange={(e) => handleVetementChange(index, "categorie_id", e.target.value)}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {categories.map((categorie) => (
                      <option key={categorie.id} value={categorie.id}>
                        {categorie.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div className="mb-3">
                  <label className="block text-blue-600 font-medium mb-1">Type</label>
                  <select
                    className={inputStyle}
                    value={vetement.type_id}
                    onChange={(e) => handleVetementChange(index, "type_id", e.target.value)}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Couleur */}
                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <label className="block text-blue-600 font-medium mb-1">Couleur</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                        value={vetement.couleur}
                        onChange={(e) => handleVetementChange(index, "couleur", e.target.value)}
                      />
                      <span className="text-sm text-gray-600">
                        {vetement.couleur}
                      </span>
                    </div>
                  </div>
                </div>

               
              </div>
            ))}

            <button
              type="button"
              onClick={addVetement}
              className={`${buttonStyle} bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Ajouter un vêtement
            </button>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            className={`${buttonStyle} bg-blue-600 hover:bg-blue-700 w-full py-3 text-lg`}
          >
            Enregistrer le lavage
          </button>
        </form>
      </div>

      {/* Modale d'ajout de client */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Nouveau Client</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                router.post("/clients", newClient, {
                  onSuccess: () => {
                    setShowModal(false);
                    setNewClient({ nom: "", prenom: "", email: "", telephone: "" });
                    toast.success("Client ajouté avec succès");
                  },
                  onError: (errors) => {
                    toast.error("Erreur lors de l'ajout du client");
                    console.error(errors);
                  },
                });
              }}>
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="Nom"
                    className={inputStyle}
                    value={newClient.nom}
                    onChange={(e) => setNewClient({...newClient, nom: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Prénom"
                    className={inputStyle}
                    value={newClient.prenom}
                    onChange={(e) => setNewClient({...newClient, prenom: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className={inputStyle}
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    className={inputStyle}
                    value={newClient.telephone}
                    onChange={(e) => setNewClient({...newClient, telephone: e.target.value})}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`${buttonStyle} bg-gray-500 hover:bg-gray-600`}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className={`${buttonStyle} bg-blue-600 hover:bg-blue-700`}
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </LayoutReceptionniste>
  );
};

export default NouveauLavage;