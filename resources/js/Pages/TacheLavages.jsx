import React, { useState } from "react";
import { usePage } from "@inertiajs/react"; // Pour récupérer les données injectées depuis Laravel
import { Inertia } from "@inertiajs/inertia"; // Pour gérer les requêtes via Inertia
import LayoutLaveur from "@/Layouts/LayoutLaveur"; // Layout personnalisé pour les Laveur

const TacheLavages = () => {
  // Récupérer les données injectées via Inertia
  const { vetements } = usePage().props;

  // Fonction pour mettre à jour l’état d’un vêtement
  const handleMarkAsFinished = (vetementId) => {
    // Envoyer une requête pour mettre à jour l’état du vêtement
    Inertia.post(`/vetements/${vetementId}/update-etat`, { etat: "En repassage" }, {
      onSuccess: () => {
        alert("Vêtement mis à jour avec succès !");
      },
      onError: (errors) => {
        console.error(errors);
        alert("Une erreur s'est produite lors de la mise à jour.");
      },
    });
  };

  // Filtrer les vêtements qui sont "En lavage"
  const vetementsEnLavage = vetements.filter((vetement) => vetement.etat === "En lavage");

  return (
    <LayoutLaveur>
      <div className="p-6 bg-white rounded-lg shadow-md">
        {/* Titre */}
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Tâches en Lavage</h1>

        {/* Vérification s'il y a des vêtements en lavage */}
        {vetementsEnLavage.length === 0 ? (
          <p className="text-gray-500">Aucun vêtement n'est actuellement en lavage.</p>
        ) : (
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border px-4 py-2">Catégorie</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Couleur</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {vetementsEnLavage.map((vetement) => (
                <tr key={vetement.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{vetement.categorie.nom}</td>
                  <td className="border px-4 py-2">{vetement.type.nom}</td>
                  <td className="border px-4 py-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: vetement.couleur }}
                    ></div>
                  </td>
                  <td className="border px-4 py-2">
                    {/* Bouton pour marquer comme terminé */}
                    <button
                      onClick={() => handleMarkAsFinished(vetement.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      Terminé
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </LayoutLaveur>
  );
};

export default TacheLavages;
