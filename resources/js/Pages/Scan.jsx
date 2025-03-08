import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode"; // 📌 Importation du scanner QR

const VerificationModal = ({ showModal, setShowModal, handleVerification }) => {
  const [codeRetrait, setCodeRetrait] = useState(""); // 📌 Stocke le code entré/scanné
  const [message, setMessage] = useState(""); // 📌 Gère les erreurs ou succès
  const [mode, setMode] = useState("manual"); // 📌 Permet de basculer entre saisie manuelle et scan

  useEffect(() => {
    if (mode === "qr" && showModal) {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

      scanner.render(
        (decodedText) => {
          setCodeRetrait(decodedText); // 📌 Remplit automatiquement l’input avec le QR scanné
          setMode("manual"); // 📌 Bascule en mode manuel après un scan réussi
          scanner.clear(); // 📌 Stoppe le scanner après un scan réussi
        },
        (errorMessage) => {
          console.log("Erreur scan QR :", errorMessage);
        }
      );

      return () => scanner.clear();
    }
  }, [mode, showModal]);

  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Vérification du Code</h2>

          <p className="text-gray-600">Entrez ou scannez le code de retrait :</p>

          {/* ✅ Toggle entre saisie manuelle et scan QR */}
          <div className="flex justify-center mb-3">
            <button
              onClick={() => setMode("manual")}
              className={`px-4 py-2 rounded-l ${mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Saisie manuelle
            </button>
            <button
              onClick={() => setMode("qr")}
              className={`px-4 py-2 rounded-r ${mode === "qr" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
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
              placeholder="Entrez le code de retrait..."
            />
          )}

          {/* ✅ Mode Scan QR */}
          {mode === "qr" && <div id="reader" className="w-full" />} {/* 📌 Zone du scanner QR */}

          {message && <p className="text-red-500 mt-2">{message}</p>}

          {/* ✅ Boutons de confirmation / annulation */}
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
              onClick={() => handleVerification(codeRetrait)} // 📌 Envoie le code saisi ou scanné
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default VerificationModal;
