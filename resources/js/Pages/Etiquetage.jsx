import React from "react";
import QRCode from "react-qr-code";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import { Inertia } from "@inertiajs/inertia";

export default function Etiquetage({ lavages }) {

   
    const handlePrint = () => {
        window.print();
         // ✅ Mise à jour des états des vêtements après impression
         try {
             Inertia.post("/update-etat-vetements", { lavages });
            alert("Impression terminée et état mis à jour !");
        } catch (error) {
            console.error("Erreur de mise à jour des vêtements", error);
            alert("Erreur lors de la mise à jour des états.");
        }
    }

    if (!lavages) {
        return <p> AUCUN VETEMENT N'A ETE RENVOYER POUR MAUVAIS ETIQUETAGE </p>
    }

    return (
        <LayoutReceptionniste className="print:hidden">
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">🛑 Vêtements en Étiquetage</h1>

            {lavages.length === 0 ? (
                <p className="text-center text-gray-500">Aucun vêtement en étiquetage.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 shadow-sm">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="border px-4 py-2">Catégorie</th>
                                <th className="border px-4 py-2">Type</th>
                                <th className="border px-4 py-2 text-center">Couleur</th>
                                <th className="border px-4 py-2 text-center">QR Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lavages.map((lavage) =>
                                lavage.vetements.map((vetement, index) => (
                                    <tr key={vetement.id} className="hover:bg-gray-100 transition">
                                        <td className="border px-4 py-2 text-gray-700 font-medium">
                                            {vetement.categorie?.nom || "Non spécifié"}
                                        </td>
                                        <td className="border px-4 py-2 text-gray-700">
                                            {vetement.type?.nom || "Non spécifié"}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            <div
                                                className="w-6 h-6 rounded-full border border-gray-400 mx-auto"
                                                style={{ backgroundColor: vetement.couleur || "#ffffff" }}
                                            />
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            <div className="border-2 border-dashed p-2 inline-block rounded-lg">
                                                <QRCode
                                                    value={String(vetement.id)}
                                                    size={60}
                                                    bgColor="#ffffff"
                                                    fgColor="#000000"
                                                    level="L"
                                                />
                                                <p className="mt-2 font-semibold text-gray-700">
                                                    {index + 1}/{lavage.vetements.length} - {lavage.id}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="mt-4 print:hidden text-center">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          >
            Imprimer et Etiqueter
          </button>
        </div>
                </div>
            )}
        </div>
        
        </LayoutReceptionniste>
    );
}
