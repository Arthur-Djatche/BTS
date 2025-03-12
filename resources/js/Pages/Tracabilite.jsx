import React, { useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { Html5QrcodeScanner } from "html5-qrcode";
import { FaTshirt, FaUser, FaUserTie, FaPalette, FaClock, FaBan, FaSearch, FaQrcode } from "react-icons/fa";
import LayoutAdmin from "@/Layouts/LayoutAdmin";
import Layout from "@/Layouts/Layout";

const Tracabilite = () => {
  const { vetement, error } = usePage().props;
  const [vetementId, setVetementId] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef(null);

  /** ✅ Fonction de recherche via ID */
  const handleSearch = (e) => {
    e.preventDefault();
    if (vetementId) {
      Inertia.visit(`/vetements/${vetementId}/details`);
    }
  };

  /** ✅ Fonction pour démarrer le scanner */
  const startScanner = () => {
    setShowScanner(true);
  };

  /** ✅ Initialisation et nettoyage du scanner */
  useEffect(() => {
    if (showScanner && !scannerRef.current) {
      const qrScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

      qrScanner.render(
        (decodedText) => {
          setVetementId(decodedText);
          setShowScanner(false); // ✅ Fermer le scanner après scan réussi
          qrScanner.clear(); // ✅ Nettoyage du scanner
          scannerRef.current = null;
          Inertia.visit(`/vetements/${decodedText}/details`);
        },
        (error) => console.warn("Scan échoué :", error)
      );

      scannerRef.current = qrScanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [showScanner]);

  return (
    <LayoutAdmin>
    <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-4 flex items-center justify-center gap-2">
        <FaSearch /> 📍 Traçabilité des Vêtements
      </h1>

      {/* Formulaire de recherche */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={vetementId}
          onChange={(e) => setVetementId(e.target.value)}
          placeholder="Entrez l'ID du vêtement..."
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1">
          <FaSearch /> Rechercher
        </button>
      </form>

      {/* Bouton Scan QR Code */}
      {!showScanner && (
        <button
          onClick={startScanner}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4 flex items-center justify-center gap-2"
        >
          <FaQrcode /> Scanner un QR Code
        </button>
      )}

      {/* Affichage du Scanner */}
      {showScanner && <div id="reader" className="w-full flex justify-center"></div>}

      {/* Affichage des détails du vêtement */}
      {error ? (
        <div className="mt-6 p-4 border border-red-500 rounded-lg bg-red-100 text-red-600 text-center">
          <FaBan className="text-3xl mx-auto mb-2" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : vetement ? (
        <div className="mt-6 p-4 border rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaTshirt /> 🧥 Détails du Vêtement
          </h2>
          <p><strong>ID :</strong> {vetement.id}</p>
          <p className="flex items-center gap-2">
            <FaPalette className="text-gray-500" />
            <strong>Couleur :</strong> <span className="px-2 py-1 rounded" style={{ backgroundColor: vetement.couleur }}>{vetement.couleur}</span>
          </p>
          <p><strong>Catégorie :</strong> {vetement.categorie.nom}</p>
          <p><strong>Type :</strong> {vetement.type.nom}</p>
          <p className="flex items-center gap-2">
            <FaUser className="text-gray-500" />
            <strong>Client :</strong> {vetement.lavage.client.nom}
          </p>
          <p className="flex items-center gap-2">
            <FaUserTie className="text-gray-500" />
            <strong>Réceptionniste :</strong> {vetement.lavage.receptionniste ? vetement.lavage.receptionniste.nom : "Non attribué"}
          </p>
          <p className="flex items-center gap-2">
            <FaUserTie className="text-gray-500" />
            <strong>Laveur :</strong> {vetement.laveur ? vetement.laveur.nom : "Non attribué"}
          </p>
          <p className="flex items-center gap-2">
            <FaUserTie className="text-gray-500" />
            <strong>Repasseur :</strong> {vetement.repasseur ? vetement.repasseur.nom : "Non attribué"}
          </p>
          <p className="flex items-center gap-2">
            <FaClock className="text-gray-500" />
            <strong>Date de Création :</strong> {new Date(vetement.created_at).toLocaleDateString()}
          </p>
        </div>
      ) : null}
    </div>
    </LayoutAdmin>
  );
};
Tracabilite.layout = (page) => <Layout children={page} />;
export default Tracabilite;
