import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";

const EditLavage = ({ lavage }) => {
  const { clients, categories, types, consignes } = usePage().props;

  // États pour les champs du formulaire
  const [nomClient, setNomClient] = useState(lavage.client.nom);
  const [selectedClient, setSelectedClient] = useState(lavage.client);
  const [selectedConsigne, setSelectedConsigne] = useState(lavage.consigne_id);
  const [useKilogramme, setUseKilogramme] = useState(lavage.kilogrammes !== null);
  const [kilogrammes, setKilogrammes] = useState(lavage.kilogrammes || "");
  const [vetements, setVetements] = useState(lavage.vetements);

  // Gérer les changements dans les vêtements
  const handleVetementChange = (index, field, value) => {
    const updatedVetements = vetements.map((vetement, i) =>
      i === index ? { ...vetement, [field]: value } : vetement
    );
    setVetements(updatedVetements);
  };

  // Fonction pour enregistrer les modifications
  const handleUpdate = (e) => {
    e.preventDefault();

    const data = {
      client_id: selectedClient.id,
      vetements: vetements,
      consigne_id: selectedConsigne,
      kilogrammes: useKilogramme ? kilogrammes : null,
    };

    router.put(`/receptionniste/lavage/${lavage.id}`, data, {
      onSuccess: () => alert("Lavage mis à jour avec succès !"),
      onError: (errors) => alert("Erreur lors de la mise à jour."),
    });
  };

  return (
    <LayoutReceptionniste>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Modifier Lavage</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Nom du client */}
          <div>
            <label className="block text-blue-600 font-medium mb-1">Nom du client</label>
            <input
              type="text"
              className="w-full border border-blue-300 rounded px-4 py-2"
              value={nomClient}
              disabled
            />
          </div>

          {/* Consigne */}
          <div>
            <label className="block text-blue-600 font-medium">Consigne de lavage</label>
            <select className="w-full border px-4 py-2 rounded" value={selectedConsigne} onChange={(e) => setSelectedConsigne(e.target.value)}>
              {consignes.map((consigne) => (
                <option key={consigne.id} value={consigne.id}>{consigne.nom}</option>
              ))}
            </select>
          </div>

          {/* Facturation par kilogrammes */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={useKilogramme} onChange={() => setUseKilogramme(!useKilogramme)} />
              <span className="text-blue-600 font-medium">Facturer en kilogrammes</span>
            </label>
            {useKilogramme && (
              <input type="number" min="1" className="w-full border px-4 py-2 rounded mt-2" value={kilogrammes} onChange={(e) => setKilogrammes(e.target.value)} placeholder="Poids en kg" />
            )}
          </div>

          {/* Liste des vêtements */}
          {vetements.map((vetement, index) => (
            <div key={index} className="border border-blue-300 rounded-lg p-4 space-y-4">
              <h2 className="font-semibold text-blue-500">Vêtement {index + 1}</h2>

              {/* Catégorie */}
              <div>
                <label className="block text-blue-600 font-medium mb-1">Catégorie</label>
                <select className="w-full border border-blue-300 rounded px-4 py-2" value={vetement.categorie_id} onChange={(e) => handleVetementChange(index, "categorie_id", e.target.value)}>
                  {categories.map((categorie) => (
                    <option key={categorie.id} value={categorie.id}>{categorie.nom}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-blue-600 font-medium mb-1">Type</label>
                <select className="w-full border border-blue-300 rounded px-4 py-2" value={vetement.type_id} onChange={(e) => handleVetementChange(index, "type_id", e.target.value)}>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>{type.nom}</option>
                  ))}
                </select>
              </div>

              {/* Couleur */}
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-blue-600 font-medium mb-1">Couleur</label>
                  <input type="color" className="w-12 h-12 border border-blue-300 rounded" value={vetement.couleur} onChange={(e) => handleVetementChange(index, "couleur", e.target.value)} />
                </div>
              </div>
            </div>
          ))}

          {/* Bouton pour enregistrer */}
          <button type="submit" className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Mettre à jour
          </button>
        </form>
      </div>
    </LayoutReceptionniste>
  );
};

export default EditLavage;
