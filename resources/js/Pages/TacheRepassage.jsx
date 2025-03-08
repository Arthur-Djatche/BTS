import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import LayoutRepasseur from "@/Layouts/LayoutRepasseur";
import Layout from "@/Layouts/Layout";

const TacheRepassage = () => {
  const { vetements, emplacements, lavagesTermines } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [selectedLavage, setSelectedLavage] = useState(null);
  const [selectedEmplacement, setSelectedEmplacement] = useState("");

    // Ouvrir la modale si des lavages sont terminés
    useEffect(() => {
      if (lavagesTermines.length > 0) {
        setSelectedLavage(lavagesTermines[0].id);
        setShowModal(true);
      }
    }, [lavagesTermines]);

  // Fonction pour marquer un vêtement comme terminé et vérifier si tout le lavage est terminé
  const handleMarkAsFinished = (vetementId, lavageId) => {
    Inertia.patch(
      `/vetements/${vetementId}/update-etat`,
      { etat: "Terminé" },
      {
        onSuccess: () => {
          // Mettre à jour localement l'état du vêtement
          const updatedVetements = vetements.map((v) =>
            v.id === vetementId ? { ...v, etat: "Terminé" } : v
          );
          setVetements(updatedVetements);
        },
        onError: () => alert("Erreur lors de la mise à jour."),
      }
    );
  };

  // Vérifie si tous les vêtements d'un lavage sont terminés
  useEffect(() => {
    const lavageIds = [...new Set(vetements.map((v) => v.lavage_id))];

    lavageIds.forEach((lavageId) => {
      const vetementsDuLavage = vetements.filter((v) => v.lavage_id === lavageId);
      const tousTermines = vetementsDuLavage.every((v) => v.etat === "Terminé");

      if (tousTermines) {
        setSelectedLavage(lavageId);
        setShowModal(true);
      }
    });
  }, [vetements]);

  // Sauvegarde l’emplacement du lavage
  const handleSaveEmplacement = () => {
    if (!selectedEmplacement) {
      alert("Veuillez sélectionner un emplacement.");
      return;
    }

    Inertia.patch(
      `/lavages/${selectedLavage}/update-emplacement`,
      { emplacement_id: selectedEmplacement },
      {
        onSuccess: () => {
          alert("Emplacement mis à jour avec succès !");
          setShowModal(false);
          setSelectedEmplacement("");
        },
        onError: () => alert("Erreur lors de la mise à jour de l’emplacement."),
      }
    );
  };

  // Regrouper les vêtements par lavage_id
  const vetementsParLavage = vetements.reduce((acc, vetement) => {
    if (!acc[vetement.lavage_id]) acc[vetement.lavage_id] = [];
    acc[vetement.lavage_id].push(vetement);
    return acc;
  }, {});

  return (
    <LayoutRepasseur>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Tâches en Repassage</h1>

        {Object.keys(vetementsParLavage).length === 0 ? (
          <p className="text-gray-500">Aucun vêtement en repassage.</p>
        ) : (
          Object.entries(vetementsParLavage).map(([lavageId, vetements]) => (
            <div key={lavageId} className="mb-6 border-b-2 border-gray-300 pb-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">Lavage #{lavageId}</h2>
              <table className="w-full text-left border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border px-4 py-2">Catégorie</th>
                    <th className="border px-4 py-2">Type</th>
                    <th className="border px-4 py-2">Couleur</th>
                    <th className="border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vetements.map((vetement) => (
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
                        {vetement.etat === "Terminé" ? (
                          <span className="text-green-600 font-semibold">Terminé</span>
                        ) : (
                          <button
                            onClick={() => handleMarkAsFinished(vetement.id, lavageId)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                          >
                            Terminé
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

      {/* Modale de sélection d'emplacement */}
{showModal && selectedLavage && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4 text-center">Lavage #{selectedLavage} terminé</h2>
      <p className="text-gray-600 text-center mb-4">Veuillez sélectionner un emplacement pour ce lavage.</p>
      <select
        value={selectedEmplacement}
        onChange={(e) => setSelectedEmplacement(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">-- Choisir un Emplacement --</option>
        {emplacements.map((emplacement) => (
          <option key={emplacement.id} value={emplacement.id}>
            {emplacement.nom}
          </option>
        ))}
      </select>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded mr-2 hover:bg-gray-500"
        >
          Annuler
        </button>
        <button
          onClick={handleSaveEmplacement}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
)}
    </LayoutRepasseur>
  );
};

TacheRepassage.layout = (page) => <Layout children={page} />;
export default TacheRepassage;
