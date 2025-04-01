import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

const getEtatLavage = (vetements) => {
  const allRetired = vetements.every((vetement) => vetement.etat === "Retiré");
  if (allRetired) return "Retiré";
  
  const allBegin = vetements.every((vetement) => vetement.etat === "Initial");
  if (allBegin) return "non Confirmé";
  
  const allFinished = vetements.every((vetement) => vetement.etat === "Terminé");
  return allFinished ? "Prêt" : "En cours";
};

const EtatLavage = ({ lavages }) => {
  const [lavageIdSelectionne, setLavageIdSelectionne] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [codeRetrait, setCodeRetrait] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("manual");
  const [lavageDetails, setLavageDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Détection de la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredLavages = lavages.filter((lavage) =>
    lavage.id.toString().includes(searchTerm)
  );

  const handleRetirer = async (lavageId) => {
    try {
      await Inertia.post(`/lavages/${lavageId}/retirer`, null, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => toast.success("Lavage retiré avec succès !"),
        onError: () => toast.error("Une erreur s'est produite lors du retrait."),
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleFacture = (e, lavageId) => {
    e.stopPropagation();
    Inertia.visit(`/receptionniste/factures/${lavageId}`);
  };

  const verifierCodeRetrait = async (e) => {
    e.preventDefault();
    if (!lavageIdSelectionne || !codeRetrait) {
      toast.warn("Veuillez entrer un code de retrait.");
      return;
    }

    try {
      const response = await axios.post("/receptionniste/verifier-retrait", {
        lavage_id: lavageIdSelectionne,
        code_retrait: codeRetrait,
      });

      if (response.data.valid) {
        setLavageDetails(response.data.lavage);
        setShowSuccessModal(true);
        toast.success("✅ Code correct !");
        setShowModal(false);
      } else {
        toast.error("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("🚨 Erreur API :", error);
      toast.error("Erreur lors de la vérification.");
    }
  };

  useEffect(() => {
    if (mode === "qr" && showModal) {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: 250,
      });

      scanner.render(
        (decodedText) => {
          setCodeRetrait(decodedText);
          setMode("manual");
        },
        (errorMessage) => {
          console.error("Erreur de scan :", errorMessage);
        }
      );

      return () => scanner.clear();
    }
  }, [mode, showModal]);

  const handleEditer = (e, lavageId) => {
    e.stopPropagation();
    Inertia.visit(`/receptionniste/lavage/${lavageId}/edit`);
  };

  return (
    <LayoutReceptionniste>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-blue-600 mb-4">État des Lavages</h1>

        {/* Barre de recherche */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par N°..."
            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Version mobile - Liste en cartes */}
        {isMobile ? (
          <div className="space-y-3">
            {filteredLavages.map((lavage) => {
              const etat = getEtatLavage(lavage.vetements);
              return (
                <div 
                  key={lavage.id} 
                  className="bg-white p-3 rounded-lg shadow border border-gray-200"
                  onClick={() => Inertia.visit(`/lavages/${lavage.id}/details`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-blue-600">N°{lavage.id}</h3>
                      <p className="text-gray-700">{lavage.client.nom} {lavage.client.prenom} </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs text-white ${
                      etat === "Prêt" ? "bg-green-500" : 
                      etat === "En cours" ? "bg-yellow-500" : 
                      etat === "Retiré" ? "bg-gray-500" : "bg-orange-500"
                    }`}>
                      {etat}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between">
                    {etat === "Prêt" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLavageIdSelectionne(lavage.id);
                          setShowModal(true);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Retirer
                      </button>
                    )}
                    {etat === "non Confirmé" && (
                      <>
                        <button
                          onClick={(e) => handleFacture(e, lavage.id)}
                          className="bg-orange-400 text-white px-3 py-1 rounded text-sm"
                        >
                          Facture
                        </button>
                        <button
                          onClick={(e) => handleEditer(e, lavage.id)}
                          className="bg-blue-400 text-white px-3 py-1 rounded text-sm ml-2"
                        >
                          Éditer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Version desktop - Tableau */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">N° Lavage</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">État</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLavages.map((lavage) => {
                  const etat = getEtatLavage(lavage.vetements);
                  return (
                    <tr 
                      key={lavage.id} 
                      className="hover:bg-gray-50 border-t cursor-pointer"
                      onClick={() => Inertia.visit(`/lavages/${lavage.id}/details`)}
                    >
                      <td className="p-3">{lavage.id}</td>
                      <td className="p-3">{lavage.client.nom}  {lavage.client.prenom}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs text-white ${
                          etat === "Prêt" ? "bg-green-500" : 
                          etat === "En cours" ? "bg-yellow-500" : 
                          etat === "Retiré" ? "bg-gray-500" : "bg-orange-500"
                        }`}>
                          {etat}
                        </span>
                      </td>
                      <td className="p-3">
                        {etat === "Prêt" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLavageIdSelectionne(lavage.id);
                              setShowModal(true);
                            }}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Retirer
                          </button>
                        )}
                        {etat === "non Confirmé" && (
                          <>
                            <button
                              onClick={(e) => handleFacture(e, lavage.id)}
                              className="bg-orange-400 text-white px-3 py-1 rounded text-sm"
                            >
                              Facture
                            </button>
                            <button
                              onClick={(e) => handleEditer(e, lavage.id)}
                              className="bg-blue-400 text-white px-3 py-1 rounded text-sm ml-2"
                            >
                              Éditer
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Modale de vérification */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-lg font-semibold text-blue-600 mb-3">Vérification du Code</h2>

              <div className="flex justify-center mb-3">
                <button
                  onClick={() => setMode("manual")}
                  className={`px-3 py-1 rounded-l text-sm ${
                    mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  Saisie manuelle
                </button>
                <button
                  onClick={() => setMode("qr")}
                  className={`px-3 py-1 rounded-r text-sm ${
                    mode === "qr" ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  Scan QR
                </button>
              </div>

              {mode === "manual" && (
                <input
                  type="text"
                  value={codeRetrait}
                  onChange={(e) => setCodeRetrait(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Entrez le code de retrait"
                />
              )}

              {mode === "qr" && (
                <div id="reader" className="w-full flex justify-center mt-2"></div>
              )}

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setCodeRetrait("");
                    setMessage("");
                  }}
                  className="px-3 py-1 bg-gray-400 text-white rounded text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={verifierCodeRetrait}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modale de succès */}
        {showSuccessModal && lavageDetails && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
            <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-sm">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl mb-2">
                  ✓
                </div>
                <h2 className="text-lg font-bold text-green-600">Retrait Confirmé</h2>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex">
                  <span className="font-medium w-24">N° Lavage:</span>
                  <span>{lavageDetails.id}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Client:</span>
                  <span>{lavageDetails.client.nom}</span>
                </div>
                <div className="bg-blue-50 p-2 rounded mt-2">
                  <span className="font-medium">Emplacement:</span>
                  <p className="text-blue-700">{lavageDetails.emplacement.nom}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  handleRetirer(lavageIdSelectionne);
                }}
                className="w-full mt-4 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </LayoutReceptionniste>
  );
};

export default EtatLavage;