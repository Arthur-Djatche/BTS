import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

const Retrait = () => {
  const [codeRetrait, setCodeRetrait] = useState("");
  const [message, setMessage] = useState("");

  const handleVerification = () => {
    Inertia.post("/verifier-code-retrait", { code_retrait: codeRetrait }, {
      onSuccess: ({ props }) => {
        setMessage(`Code valide ! Client : ${props.lavage.client.nom}`);
      },
      onError: () => {
        setMessage("Code invalide. Veuillez réessayer.");
      }
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Vérification du Code de Retrait</h1>
      <input
        type="text"
        value={codeRetrait}
        onChange={(e) => setCodeRetrait(e.target.value)}
        className="border px-4 py-2 w-full mb-4"
        placeholder="Entrez le code de retrait..."
      />
      <button
        onClick={handleVerification}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Vérifier
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Retrait;
