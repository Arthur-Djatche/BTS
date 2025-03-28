import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import LayoutLaveur from "@/Layouts/LayoutLaveur";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TacheLavages = (success) => {
  const { vetements, emplacements, lavagesTermines } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [showtModal, setShowtModal] = useState(false);
  const [selectedVetement, setSelectedVetement] = useState(null);
  const [selectedLavage, setSelectedLavage] = useState(null);
  const [scanner, setScanner] = useState(null);
  const [selectedEmplacement, setSelectedEmplacement] = useState("");

  // Ouvrir la modale si des lavages sont terminés
  useEffect(() => {
    if (lavagesTermines.length > 0) {
      setSelectedLavage(lavagesTermines[0].id);
      setShowtModal(true);
    }
  }, [lavagesTermines]);

  const handleMarkAsFinished = (vetementId, typeConsigne) => {
    if (!typeConsigne) {
      toast.error("❌ Erreur : Type de consigne inconnu !");
      return;
    }

    const nouvelEtat = typeConsigne === "Lavage_Simple" ? "Terminé" : "En repassage";

    console.log("🔄 Envoi de la requête :", { vetementId, nouvelEtat, typeConsigne });

    Inertia.patch(`/vetements/${vetementId}/update-etat`, {
      etat: nouvelEtat,
      type_consigne: typeConsigne
    }, {
      onSuccess: () => {
        toast.success(`✅ Vêtement mis à jour à l'état : ${nouvelEtat}`);
        setShowModal(false);
      },
      onError: (errors) => {
        console.error("❌ Erreur :", errors);
        toast.error("Une erreur est survenue.");
      },
    });
  };

  const startQrScanner = (vetement) => {
    setSelectedVetement(vetement);
    setShowModal(true);

    setTimeout(() => {
      if (!scanner) {
        const html5QrCodeScanner = new Html5QrcodeScanner("qr-reader", { 
          fps: 10, 
          qrbox: { width: 250, height: 250 } 
        });

        html5QrCodeScanner.render((decodedText) => {
          console.log("QR Code détecté :", decodedText);

          if (decodedText === vetement.id.toString()) {
            toast.success("✅ Code QR valide !");
            handleMarkAsFinished(vetement.id, vetement.lavage.consigne.type_consigne);
          } else {
            toast.error("❌ Code QR invalide !");
          }

          html5QrCodeScanner.clear();
          setScanner(null);
          setShowModal(false);
        });

        setScanner(html5QrCodeScanner);
      }
    }, 500);
  };

  const handleRenvoyer = (vetement) => {
    if (!vetement.lavage_id || !vetement.etat) return;
  
    Inertia.post(`/vetements/renvoyer`, {
      lavage_id: vetement.lavage_id,
      etat: vetement.etat
    }, {
      onSuccess: () => {
        toast.success(success);
        alert("Tous les vêtements du même lavage ont été renvoyés en étiquetage !");
      }
    });
  };

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
        onError: () => alert("Erreur lors de la mise à jour de l'emplacement."),
      }
    );
  };

  const vetementsEnLavage = vetements.filter((vetement) => vetement.etat === "En lavage");

  return (
    <LayoutLaveur>
      <div className="mt-0 p-4 sm:p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-6">Tâches en Lavage</h1>

        {vetementsEnLavage.length === 0 ? (
          <p className="text-gray-500">Aucun vêtement n'est actuellement en lavage.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border px-2 sm:px-4 py-2">Catégorie</th>
                  <th className="border px-2 sm:px-4 py-2">Type</th>
                  <th className="border px-2 sm:px-4 py-2">Couleur</th>
                  <th className="border px-2 sm:px-4 py-2">Consigne</th>
                  <th className="border px-2 sm:px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {vetementsEnLavage.map((vetement) => (
                  <tr key={vetement.id} className="hover:bg-gray-100">
                    <td className="border px-2 sm:px-4 py-2">{vetement.categorie.nom}</td>
                    <td className="border px-2 sm:px-4 py-2">{vetement.type.nom}</td>
                    <td className="border px-2 sm:px-4 py-2">
                      <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full mx-auto" style={{ backgroundColor: vetement.couleur }} />
                    </td>
                    <td className="border px-2 sm:px-4 py-2 text-red-500">
                      {vetement.lavage?.consigne?.nom || "Non spécifié"}
                    </td>
                    <td className="border px-2 sm:px-4 py-2">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                        <button
                          onClick={() => startQrScanner(vetement)}
                          className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 text-sm sm:text-base"
                        >
                          Terminé
                        </button>
                        <button
                          onClick={() => handleRenvoyer(vetement)}
                          className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm sm:text-base"
                        >
                          Renvoyer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Scanner Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-700">📸 Scanner le QR Code</h2>
            <div id="qr-reader" className="mb-3 sm:mb-4"></div>
            <button
              className="mt-3 sm:mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => {
                if (scanner) {
                  scanner.clear();
                  setScanner(null);
                }
                setShowModal(false);
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Emplacement Selection Modal */}
      {showtModal && selectedLavage && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">Lavage #{selectedLavage} terminé</h2>
            <p className="text-gray-600 text-center mb-3 sm:mb-4">Veuillez sélectionner un emplacement pour ce lavage.</p>
            <select
              value={selectedEmplacement}
              onChange={(e) => setSelectedEmplacement(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
            >
              <option value="">-- Choisir un Emplacement --</option>
              {emplacements.map((emplacement) => (
                <option key={emplacement.id} value={emplacement.id}>
                  {emplacement.nom}
                </option>
              ))}
            </select>
            <div className="flex justify-end mt-3 sm:mt-4 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-3 sm:px-4 py-2 rounded hover:bg-gray-500 text-sm sm:text-base"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveEmplacement}
                className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutLaveur>
  );
};

export default TacheLavages;