// Importation des modules nécessaires
import React, { useState } from "react"; // Gestion des états locaux
import { Inertia } from "@inertiajs/inertia"; // Gestion des requêtes avec Inertia.js
import { usePage } from "@inertiajs/react"; // Récupération des données injectées via Inertia
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste"; // Layout personnalisé pour les réceptionnistes
import Layout from "@/Layouts/Layout";

/**
 * Fonction utilitaire : Détermine l'état d'un lavage en fonction des états des vêtements associés.
 * @param {Array} vetements - Liste des vêtements associés au lavage.
 * @returns {string} - "Retiré", "Prêt", ou "En cours".
 */
const getEtatLavage = (vetements) => {
  // Vérifie si tous les vêtements sont dans l'état "Retiré"
  const allRetired = vetements.every((vetement) => vetement.etat === "Retiré");
  if (allRetired) {
    return "Retiré"; // Retourne "Retiré" si tous les vêtements sont retirés
  }

  // Vérifie si tous les vêtements sont dans l'état "Terminé"
  const allFinished = vetements.every((vetement) => vetement.etat === "Terminé");
  return allFinished ? "Prêt" : "En cours"; // Retourne "Prêt" ou "En cours"
};

// Composant principal pour afficher l'état des lavages
const EtatLavage = () => {
  // Récupération des données injectées par Inertia (liste des lavages et autres informations)
  const { lavages } = usePage().props;

  // État local pour la recherche (filtrer les lavages par ID)
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Fonction de recherche : Met à jour le filtre basé sur l'ID du lavage.
   * @param {Object} e - Événement de changement dans l'input.
   */
  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Met à jour le terme de recherche
  };

  // Filtrer les lavages en fonction du terme recherché
  const filteredLavages = lavages.filter((lavage) =>
    lavage.id.toString().includes(searchTerm)
  );

  /**
   * Gestion du clic sur "Retirer" : Met à jour l'état du lavage et des vêtements associés.
   * @param {number} lavageId - ID du lavage à retirer.
   */
  const handleRetirer = async (lavageId) => {
    try {
      await Inertia.post(`/lavages/${lavageId}/retirer`, null, {
        onSuccess: () => {
          alert("Lavage retiré avec succès !");
        },
        onError: (errors) => {
          console.error(errors);
          alert("Une erreur s'est produite lors de la mise à jour.");
        },
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  // Affichage du composant
  return (
    <LayoutReceptionniste>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">État des Lavages</h1>

        {/* Barre de recherche */}
        <div className="mb-6">
          <label htmlFor="search" className="block text-blue-600 font-medium mb-2">
            Rechercher un lavage par ID
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Entrez l'ID du lavage..."
            className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tableau des lavages */}
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID Lavage</th>
              <th className="border px-4 py-2">Nom Client</th>
              <th className="border px-4 py-2">État</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Itération sur les lavages filtrés */}
            {filteredLavages.map((lavage) => {
              const etat = getEtatLavage(lavage.vetements); // Détermine l'état du lavage
              return (
                <tr
                  key={lavage.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => Inertia.visit(`/lavages/${lavage.id}/details`)} // Redirection vers les détails
                >
                  <td className="border px-4 py-2">{lavage.id}</td>
                  <td className="border px-4 py-2">{lavage.client.nom}</td>
                  <td className="border px-4 py-2">{etat}</td>
                  <td className="border px-4 py-2">
                    {/* Bouton "Retirer" si l'état est "Prêt" */}
                    {etat === "Prêt" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Empêche l'exécution de l'événement parent (redirection)
                          handleRetirer(lavage.id); // Met à jour l'état du lavage
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
                      >
                        Retirer
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </LayoutReceptionniste>
  );
};
EtatLavage.layout = (page) => <Layout children={page} />;


export default EtatLavage;
