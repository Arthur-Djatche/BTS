import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import LayoutRepasseur from "@/Layouts/LayoutRepasseur";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TacheRepassage = () => {
  const { vetements, emplacements, lavagesTermines } = usePage().props;
  const [showEmplacementModal, setShowEmplacementModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedLavage, setSelectedLavage] = useState(null);
  const [selectedEmplacement, setSelectedEmplacement] = useState("");
  const [scanner, setScanner] = useState(null);
  const [selectedVetement, setSelectedVetement] = useState(null);
  const [clickedTerminer, setClickedTerminer] = useState({});

  // Ouvrir la modale si des lavages sont terminés
  useEffect(() => {
    if (lavagesTermines.length > 0) {
      setSelectedLavage(lavagesTermines[0].id);
      setShowEmplacementModal(true);
    }
  }, [lavagesTermines]);

  // Fonction pour marquer un vêtement comme terminé
  const handleMarkAsFinished = (vetementId) => {
    Inertia.patch(
      `/vetements/${vetementId}/update-etat`,
      { etat: "Terminé" },
      {
        onSuccess: () => {
          toast.success("Vêtement marqué comme terminé !");
        },
        onError: () => toast.error("Erreur lors de la mise à jour."),
      }
    );
  };

  // Fonction pour enregistrer qu'un bouton Terminer a été cliqué
  const handleClickTerminer = (vetementId, lavageId) => {
    setClickedTerminer(prev => ({
      ...prev,
      [vetementId]: true
    }));
    startQrScanner(vetements.find(v => v.id === vetementId));
  };

  // Fonction pour vérifier si le bouton Renvoyer doit être actif
  const shouldEnableRenvoyer = (lavageId) => {
    const vetementsDuLavage = vetements.filter(v => v.lavage_id == lavageId);
    if (vetementsDuLavage.length <= 1) return true; // Actif si 1 seul vêtement
    
    const vetementsAvecTerminerClique = vetementsDuLavage.filter(v => clickedTerminer[v.id]);
    return vetementsAvecTerminerClique.length >= Math.ceil(vetementsDuLavage.length / 2);
  };

  const handleRenvoyer = (lavageId) => {
    Inertia.post(`/vetements/renvoyer`, {
      lavage_id: lavageId,
      etat: "À étiqueter"
    }, {
      onSuccess: () => {
        toast.success("Les vêtements ont été renvoyés en étiquetage !");
        // Réinitialiser les clics pour ce lavage
        const vetementsIds = vetements.filter(v => v.lavage_id == lavageId).map(v => v.id);
        setClickedTerminer(prev => {
          const newState = {...prev};
          vetementsIds.forEach(id => delete newState[id]);
          return newState;
        });
      },
      onError: () => {
        toast.error("Erreur lors du renvoi des vêtements");
      }
    });
  };

  // Vérifie si tous les vêtements d'un lavage sont terminés
  useEffect(() => {
    const lavageIds = [...new Set(vetements.map((v) => v.lavage_id))];

    lavageIds.forEach((lavageId) => {
      const vetementsDuLavage = vetements.filter((v) => v.lavage_id === lavageId);
      const tousTermines = vetementsDuLavage.every((v) => v.etat === "Terminé");

      if (tousTermines) {
        setSelectedLavage(lavageId);
        setShowEmplacementModal(true);
      }
    });
  }, [vetements]);

  // Sauvegarde l'emplacement du lavage
  const handleSaveEmplacement = () => {
    if (!selectedEmplacement) {
      toast.warning("Veuillez sélectionner un emplacement.");
      return;
    }

    Inertia.patch(
      `/lavages/${selectedLavage}/update-emplacement`,
      { emplacement_id: selectedEmplacement },
      {
        onSuccess: () => {
          toast.success("Emplacement mis à jour avec succès !");
          setShowEmplacementModal(false);
          setSelectedEmplacement("");
        },
        onError: () => toast.error("Erreur lors de la mise à jour de l'emplacement."),
      }
    );
  };

  const startQrScanner = (vetement) => {
    setSelectedVetement(vetement);
    setShowQrModal(true);

    // Délai pour permettre au modal de s'afficher avant d'initialiser le scanner
    setTimeout(() => {
      if (scanner) {
        scanner.clear();
      }

      const html5QrCodeScanner = new Html5QrcodeScanner(
        "qr-reader", 
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 } 
        },
        false
      );

      const onScanSuccess = (decodedText) => {
        console.log("QR Code détecté :", decodedText);

        if (decodedText === vetement.id.toString()) {
          toast.success("✅ Code QR valide !");
          handleMarkAsFinished(vetement.id);
        } else {
          toast.error("❌ Code QR invalide !");
        }

        html5QrCodeScanner.clear();
        setScanner(null);
        setShowQrModal(false);
      };

      const onScanFailure = (error) => {
        console.log("Scan error:", error);
      };

      html5QrCodeScanner.render(onScanSuccess, onScanFailure);
      setScanner(html5QrCodeScanner);
    }, 500);
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setShowQrModal(false);
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
    Object.entries(vetementsParLavage).map(([lavageId, vetements]) => {
      // Vérifier le type de consigne pour ce lavage
      const typeConsigne = vetements[0]?.lavage?.consigne?.type_consigne;
      const isRepassageSimple = typeConsigne === 'Repassage_Simple';
      
      return (
        <div key={lavageId} className="mb-6 border-b-2 border-gray-300 pb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-blue-700">Lavage #{lavageId}</h2>
            
            {/* Afficher le bouton seulement si Repassage_Simple */}
            {isRepassageSimple && (
              <button
                onClick={() => handleRenvoyer(lavageId)}
                disabled={!shouldEnableRenvoyer(lavageId)}
                className={`px-4 py-2 rounded focus:outline-none focus:ring-2 ${
                  shouldEnableRenvoyer(lavageId)
                    ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Renvoyer
              </button>
            )}
          </div>
          
          {/* Ajouter un badge pour indiquer le type de consigne */}
          <div className="mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              typeConsigne === 'Repassage_Simple' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {typeConsigne?.replace('_', ' ') || 'Type inconnu'}
            </span>
          </div>
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
                            onClick={() => handleClickTerminer(vetement.id, vetement.lavage_id)}
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
      );
})
        )}
      </div>

      {/* QR Code Scanner Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-700">📸 Scanner le QR Code</h2>
            <div id="qr-reader" className="mb-3 sm:mb-4"></div>
            <button
              className="mt-3 sm:mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={stopScanner}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Modale de sélection d'emplacement */}
      {showEmplacementModal && selectedLavage && (
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
                onClick={() => setShowEmplacementModal(false)}
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

export default TacheRepassage;