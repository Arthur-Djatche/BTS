// Importation des modules nécessaires
import React, { useState, useEffect } from "react"; // Gestion des états locaux
import { Inertia } from "@inertiajs/inertia"; // Gestion des requêtes avec Inertia.js
import { usePage } from "@inertiajs/react"; // Récupération des données injectées via Inertia
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste"; // Layout personnalisé pour les réceptionnistes
// import Layout from "@/Layouts/Layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode"; // 📌 Importation du scanner QR


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
  const allBegin = vetements.every((vetement) => vetement.etat ==="Initial");
  if (allBegin) {
    return "ImprimerFacture";
  }

  // Vérifie si tous les vêtements sont dans l'état "Terminé"
  const allFinished = vetements.every((vetement) => vetement.etat === "Terminé");
  return allFinished ? "Prêt" : "En cours"; // Retourne "Prêt" ou "En cours"
};

// Composant principal pour afficher l'état des lavages
const EtatLavage = ({lavages}) => {
  // Récupération des données injectées par Inertia (liste des lavages et autres informations)
  const [lavageIdSelectionne, setLavageIdSelectionne] = useState(null); // Stocker l'ID du lavage sélectionné
const [showModal, setShowModal] = useState(false); // Contrôle l'affichage de la modale
const [showSuccessModal, setShowSuccessModal] = useState(false); // ✅ Nouvelle modale de succès
const [codeRetrait, setCodeRetrait] = useState(""); // Stocke le code de retrait saisi
const [message, setMessage] = useState(""); // Message de succès ou d'erreur
const [mode, setMode] = useState("manual"); // ✅ Mode actuel (manuel ou QR)
const [lavageDetails, setLavageDetails] = useState(null); // ✅ Stocker les infos du lavage validé



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
         preserveState: true, // ✅ Empêche le reset de la page
      preserveScroll: true, // ✅ Empêche de remonter en haut de la page
        onSuccess: () => {
          toast.success("Lavage retiré avec succès !");
        },
        onError: (errors) => {
          console.error(errors);
          toast.error("Une erreur s'est produite lors du retrait.");
        },
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
        setShowSuccessModal(true); // ✅ Afficher la seconde modale
        toast.success("✅ Code correct !");
        setShowModal(false);
      

        // ✅ Mettre à jour les détails du lavage
       
      } else {
        toast.error("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("🚨 Erreur API :", error);
      toast.error("Erreur lors de la vérification.");
    }
  };
  
  const handleVerification = async () => {
    if (!lavageIdSelectionne || !codeRetrait) {
        toast.warn("Veuillez entrer un code de retrait.");
        return;
    }

    try {
        const response = await axios.post("http://127.0.0.1:8000/receptionniste/verifier-retrait", {
            lavage_id: lavageIdSelectionne,
            code_retrait: codeRetrait,
        });

        console.log("🔍 Réponse API :", response.data);

        if (response.data.valid) {
            toast.success("✅ Code correct !");
            setShowModal(false);
            handleRetirer(lavageIdSelectionne);
        } else {
            toast.error("❌ " + response.data.message);
        }
    } catch (error) {
        console.error("🚨 Erreur API :", error);
        toast.error("Erreur lors de la vérification.");
    }
};

 // ✅ Scanner QR Code avec html5-qrcode
 useEffect(() => {
  if (mode === "qr" && showModal) {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        setCodeRetrait(decodedText); // ✅ Récupération du code scanné
        setMode("manual"); // Retour en mode manuel après scan
      },
      (errorMessage) => {
        console.error("Erreur de scan :", errorMessage);
      }
    );

    return () => scanner.clear();
  }
}, [mode, showModal]);
  
  

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
                   onClick={() => Inertia.visit(`/lavages/${lavage.id}/details`)}// Redirection vers les détails
                >
                  <td 
                  
                  className="border px-4 py-2" > {lavage.id}
                  </td>
                  <td className="border px-4 py-2">{lavage.client.nom}</td>
                  <td className="border px-4 py-2">{etat}</td>
                  <td className="border px-4 py-2">
                    {/* Bouton "Retirer" si l'état est "Prêt" */}
                    {etat === "Prêt" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Empêche l'exécution de l'événement parent (redirection)
                          setLavageIdSelectionne(lavage.id); // Stocke l'ID du lavage cliqué
                          setShowModal(true); // Met à jour l'état du lavage
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
                      >
                        Retirer
                      </button>
                      
                    )}
                    {etat === "ImprimerFacture" && (
  <button
    onClick={(e) => {
      handleFacture(e, lavage.id);
    }}
    className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 focus:outline-none"
  >
    Imprimer Facture
  </button>
)}

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
       {/* Fenêtre Modale de Vérification */}
       {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Vérification du Code</h2>

            {/* ✅ Choix entre saisie manuelle ou scan QR */}
            <div className="flex justify-center mb-3">
              <button
                onClick={() => setMode("manual")}
                className={`px-4 py-2 rounded-l ${
                  mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Saisie manuelle
              </button>
              <button
                onClick={() => setMode("qr")}
                className={`px-4 py-2 rounded-r ${
                  mode === "qr" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Scan QR
              </button>
            </div>

            {/* ✅ Mode Saisie Manuelle */}
            {mode === "manual" && (
              <input
                type="text"
                value={codeRetrait}
                onChange={(e) => setCodeRetrait(e.target.value)}
                className="w-full border px-4 py-2 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            {/* ✅ Mode Scan QR */}
            {mode === "qr" && (
              <div id="reader" className="w-full flex justify-center mt-4"></div>
            )}

            {message && <p className="text-red-500 mt-2">{message}</p>}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setCodeRetrait("");
                  setMessage("");
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Annuler
              </button>

              <button
                onClick={verifierCodeRetrait}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

     {/* ✅ Seconde Modale : Détails du Lavage */}
{showSuccessModal && lavageDetails && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all">
      {/* ✅ En-tête de succès */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl">
          ✅
        </div>
        <h2 className="text-2xl font-bold text-green-600 mt-4">
          Retrait Confirmé !
        </h2>
        <p className="text-gray-600 text-center">
          Le retrait du lavage a été validé avec succès.
        </p>
      </div>

      {/* ✅ Détails du lavage */}
      <div className="mt-6 border-t border-gray-300 pt-4 space-y-4">
        {/* ID Lavage */}
        <div className="flex items-center">
          <span className="text-blue-600 text-xl mr-2">🆔</span>
          <p className="text-lg">
            <strong>ID Lavage :</strong> {lavageDetails.id}
          </p>
        </div>

        {/* Nom Client */}
        <div className="flex items-center">
          <span className="text-blue-600 text-xl mr-2">👤</span>
          <p className="text-lg">
            <strong>Client :</strong> {lavageDetails.client.nom} {lavageDetails.client.prenom}
          </p>
        </div>

        {/* Emplacement mis en avant */}
        <div className="flex items-center bg-blue-100 p-3 rounded-lg shadow-md">
          <span className="text-blue-700 text-2xl mr-3">📍</span>
          <p className="text-lg text-blue-700 font-semibold">
            Emplacement : {lavageDetails.emplacement.nom}
          </p>
        </div>
      </div>

      {/* ✅ Bouton de fermeture */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            setShowSuccessModal(false); // Fermer la modale
            handleRetirer(lavageIdSelectionne); // ✅ Exécuter le retrait après la fermeture
          }}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
)}

    </LayoutReceptionniste>
  );
};
// EtatLavage.layout = (page) => <Layout children={page} />;


export default EtatLavage;
