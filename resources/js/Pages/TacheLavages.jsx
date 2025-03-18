import React, { useState } from "react";
import { usePage } from "@inertiajs/react"; // Pour récupérer les données injectées depuis Laravel
import { Inertia } from "@inertiajs/inertia"; // Pour gérer les requêtes via Inertia
import LayoutLaveur from "@/Layouts/LayoutLaveur"; // Layout personnalisé pour les Laveur

const TacheLavages = () => {
  const { vetements } = usePage().props;

  const handleMarkAsFinished = (vetementId, typeConsigne) => {
    if (!typeConsigne) {
      alert("❌ Erreur : Type de consigne inconnu !");
      return;
    }
  
    const nouvelEtat = typeConsigne === "Lavage_Simple" ? "Terminé" : "En repassage";
  
    console.log("🔄 Envoi de la requête :", { vetementId, nouvelEtat, typeConsigne });
  
    Inertia.patch(`/vetements/${vetementId}/update-etat`, { 
      etat: nouvelEtat,
      type_consigne: typeConsigne
    }, {
      onSuccess: () => {
        alert(`✅ Vêtement mis à jour à l'état : ${nouvelEtat}`);
      },
      onError: (errors) => {
        console.error("❌ Erreur :", errors);
        alert("Une erreur est survenue.");
      },
    });
  };
  


  // Filtrer les vêtements "En lavage"
  const vetementsEnLavage = vetements.filter((vetement) => vetement.etat === "En lavage");

  return (
    <LayoutLaveur>
      <div className="mt-0 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Tâches en Lavage</h1>

        {vetementsEnLavage.length === 0 ? (
          <p className="text-gray-500">Aucun vêtement n'est actuellement en lavage.</p>
        ) : (
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border px-4 py-2">Catégorie</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Couleur</th>
                <th className="border px-4 py-2">Consigne</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {vetementsEnLavage.map((vetement) => (
                <tr key={vetement.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{vetement.categorie.nom}</td>
                  <td className="border px-4 py-2">{vetement.type.nom}</td>
                  <td className="border px-4 py-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: vetement.couleur }} />
                  </td>
                  <td className="border px-4 py-2 text-red-500">
                    {vetement.lavage?.consigne?.nom || "Non spécifié"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => {
                        if (vetement.lavage?.consigne?.type_consigne) {
                          handleMarkAsFinished(vetement.id, vetement.lavage.consigne.type_consigne);
                        } else {
                          alert("Erreur : Aucune consigne associée !");
                        }
                      }}
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
