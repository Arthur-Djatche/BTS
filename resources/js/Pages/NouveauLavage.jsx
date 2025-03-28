import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/inertia-react";
import { usePage } from "@inertiajs/react";

import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import Barcode from "react-barcode";
import { router } from '@inertiajs/react';

const NouveauLavage = () => {
  const [nomClient, setNomClient] = useState("");
  const [nombreVetements, setNombreVetements] = useState(1);
  const [vetements, setVetements] = useState([{ categorie_id: "", type_id: "", couleur: "#000000" }]);
  const [facture, setFacture] = useState(null); // Facture pour la deuxième étape
  const { clients, categories, types, consignes } = usePage().props;
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]); // Liste filtrée des clients
  const [selectedConsigne, setSelectedConsigne] = useState("");
  const [useKilogramme, setUseKilogramme] = useState(false);
  const [kilogrammes, setKilogrammes] = useState("");
  


  const handleClientSelect = (client) => {
    setNomClient(client.nom); // Affiche le nom sélectionné dans le champ
    setSelectedClient(client); // Stocke l'objet complet du client sélectionné
    setDropdownVisible(false); // Masque la liste déroulante
  };
  
  

  const handleClientChange = (e) => {
    const input = e.target.value;
    setNomClient(input);
  
    // Filtrer les clients correspondants
    const matches = clients.filter((client) =>
      client.nom.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredClients(matches); // Met à jour la liste déroulante
    setDropdownVisible(true); // Affiche la liste déroulante
  };
  
  


   // État pour la fenêtre modale d'ajout de client
   const [showModal, setShowModal] = useState(false);
   const [newClient, setNewClient] = useState({
     nom: "",
     prenom: "",
     email: "",
     telephone: "",
   });

  useEffect(() => {
    const difference = nombreVetements - vetements.length;
    if (difference > 0) {
      setVetements((prev) => [
        ...prev,
        ...Array(difference).fill({ categorie_id: "", type_id: "", couleur: "#000000" }),
      ]);
    } else if (difference < 0) {
      setVetements((prev) => prev.slice(0, nombreVetements));
    }
  }, [nombreVetements]);

  const handleVetementChange = (index, field, value) => {
    const updatedVetements = vetements.map((vetement, i) =>
      i === index ? { ...vetement, [field]: value } : vetement
    );
    setVetements(updatedVetements);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedClient) {
      alert("Veuillez sélectionner un client.");
      return;
    }

    if (vetements.length === 0) {
      alert("Veuillez ajouter au moins un vêtement.");
      return;
    }


    const data = {
      client_id: selectedClient.id,
      vetements: vetements,
      consigne_id: selectedConsigne,
      kilogrammes: useKilogramme ? kilogrammes : null,  

    };

    console.log("Données envoyées :", data);

    router.post("/receptionniste/nouveau-lavage", data, {
      onSuccess: (response) => {
        console.log("✅ Réponse Laravel complète :", response);
      },
      onError: (errors) => {
        console.error("❌ Erreur lors de l'enregistrement :", errors);
        alert("Erreur lors de l'enregistrement.");
      },
    });
};

  const handleAddClient = (e) => {
    e.preventDefault();
    router.post("/clients", newClient, {
      onSuccess: () => {
        setShowModal(false); // Fermer la fenêtre après succès
        setNewClient({ nom: "", prenom: "", email: "", telephone: "" }); // Réinitialiser le formulaire
      },
    });
  };


  // Étape 1 : Formulaire de lavage
  return (
    <LayoutReceptionniste>
      
        <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Nouveau Lavage</h1>
        <form className="space-y-4">
          {/* Zone de recherche du client */}
<div className="flex items-center gap-4">
<div className="flex-grow">
  <label className="block text-blue-600 font-medium mb-1">Nom du client</label>
  <input
    type="text"
    className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={nomClient}
    onChange={(e) => handleClientChange(e)} // Appel à handleClientChange lors de la saisie
    onBlur={() => setTimeout(() => setDropdownVisible(false), 200)} // Masque la liste avec un délai
    onFocus={() => setDropdownVisible(true)} // Affiche la liste déroulante lorsque le champ est activé
    placeholder="Rechercher un client..."
  />
  {isDropdownVisible && nomClient && (
    <ul className="bg-white border border-blue-300 rounded mt-1 max-h-40 overflow-y-auto">
      {clients
        .filter((client) =>
          client.nom.toLowerCase().includes(nomClient.toLowerCase())
        )
        .map((filteredClient) => (
          <li
            key={filteredClient.id}
            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            onClick={() => handleClientSelect(filteredClient)} // Appel à handleClientSelect lors de la sélection
          >
            {filteredClient.nom} <br /> {filteredClient.email}
          </li>
        ))}
    </ul>
  )}
</div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-7 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
            >
              Ajouter Client
            </button>
          </div>
          <div>
            <label className="block text-blue-600 font-medium">Consigne de lavage</label>
            <select className="w-full border px-4 py-2 rounded" value={selectedConsigne} onChange={(e) => setSelectedConsigne(e.target.value)}>
              <option value="">-- Sélectionner une consigne --</option>
              {consignes.map((consigne) => (
                <option key={consigne.id} value={consigne.id}>{consigne.nom}-{consigne.type_consigne}---{consigne.priorite_consigne}</option>
              ))}
            </select>
          </div>
           {/* Activer/Désactiver le kilogrammage */}
           <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useKilogramme} onChange={() => setUseKilogramme(!useKilogramme)} />
              <span className="text-blue-600 font-medium">Facturer en kilogrammes</span>
            </label>
            {useKilogramme && (
              <input type="number" min="1" className="w-full border px-4 py-2 rounded mt-2" value={kilogrammes} onChange={(e) => setKilogrammes(e.target.value)} placeholder="Saisir le poids (kg)" />
            )}
          </div>

          {/* Nombre de vêtements */}
          <div>
            <label className="block text-blue-600 font-medium mb-1">Nombre de vêtements</label>
            <input
              type="number"
              min="1"
              className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nombreVetements}
              onChange={(e) => setNombreVetements(Number(e.target.value))}
            />
          </div>

          {/* Liste des vêtements */}
          {vetements.map((vetement, index) => (
            <div key={index} className="border border-blue-300 rounded-lg p-4 space-y-4">
              <h2 className="font-semibold text-blue-500">Vêtement {index + 1}</h2>

              {/* Catégorie */}
              <div>
                <label className="block text-blue-600 font-medium mb-1">Catégorie</label>
                <select
                  className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={vetement.categorie_id}
                  onChange={(e) => handleVetementChange(index, "categorie_id", e.target.value)}
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
              <div>
                <label className="block text-blue-600 font-medium mb-1">Type</label>
                <select
                  type="text"
                  className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={vetement.type_id}
                  onChange={(e) => handleVetementChange(index, "type_id", e.target.value)}
                 
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
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-blue-600 font-medium mb-1">Couleur</label>
                  <input
                    type="color"
                    className="w-12 h-12 border border-blue-300 rounded"
                    value={vetement.couleur}
                    onChange={(e) => handleVetementChange(index, "couleur", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Bouton Suivant */}
          
          <button   onClick={handleSave}
 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            
          >
            Suivant
          </button> 
        
        </form>
      </div>

       {/* Fenêtre contextuelle */}
       {showModal && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">Ajouter un Client</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Empêche le rechargement de la page
          router.post("/clients", newClient, {
            onSuccess: () => {
              setShowModal(false); // Fermer la fenêtre si la requête est réussie
              setNewClient({ nom: "", prenom: "", email: "", telephone: "" }); // Réinitialiser le formulaire
            },
            onError: (errors) => {
              console.error(errors); // Affiche les erreurs éventuelles dans la console
            },
          });
        }}
        className="space-y-4"
      >
        {/* Champ Nom */}
        <input
          type="text"
          placeholder="Nom"
          value={newClient.nom}
          onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {/* Champ Prénom */}
        <input
          type="text"
          placeholder="Prénom"
          value={newClient.prenom}
          onChange={(e) => setNewClient({ ...newClient, prenom: e.target.value })}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {/* Champ Email */}
        <input
          type="email"
          placeholder="Email"
          value={newClient.email}
          onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {/* Champ Téléphone */}
        <input
          type="tel"
          placeholder="Téléphone"
          value={newClient.telephone}
          onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {/* Boutons Valider et Annuler */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Valider
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </LayoutReceptionniste>
  );
};


export default NouveauLavage;
