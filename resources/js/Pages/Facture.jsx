import React from "react";
import QRCode from "react-qr-code";
import { usePage } from "@inertiajs/react";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import { Inertia } from "@inertiajs/inertia";
import { router } from "@inertiajs/react"; // ✅ Import correct
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";




const Facture = () => {
  const { lavage, structure, acteur } = usePage().props;

  // Vérification des données avant d'afficher la facture
  console.log("Props reçus :", { lavage, structure, acteur });
  if (!lavage || !structure || !acteur) {
    return <p>Chargement...</p>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  const togglePaymentStatus = () => {
    router.post(`/lavages/${lavage.id}/toggle-status`, {}, {
        preserveScroll: true,
        onSuccess: () => console.log("Statut mis à jour !")
    });
};

  const handlePrintAndUpdate = () => {
    if (!lavage || !lavage.vetements) {
      console.error("❌ Erreur : Données de lavage indisponibles !");
      return;
    }
  
    lavage.vetements.forEach((vetement) => {
      const nouvelEtat = lavage.consigne?.type_consigne === "Repassage_Simple" ? "En repassage" : "En lavage";
  
      Inertia.patch(`/vetements/${vetement.id}/update-etat`, {
        etat: nouvelEtat
      }, {
        onSuccess: () => {
          console.log(`✅ Vêtement ${vetement.id} mis à jour à l'état : ${nouvelEtat}`);
        },
        onError: (errors) => {
          console.error(`❌ Erreur mise à jour vêtement ${vetement.id} :`, errors);
        },
      });
    });
  
    window.print();
    Inertia.visit(`/receptionniste/nouveau-lavage`);
  };
  

  return (
    <LayoutReceptionniste className="print:hidden">
      <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto print:max-w-full border">
        {/* ✅ En-tête avec Infos Structure */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-full">
              <span className="text-gray-500 text-xs">LOGO</span>
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-700">{structure.nom_structure}</h2>
          <p className="text-sm text-gray-600">{structure.ville} - {structure.telephone}</p>
          <p className="text-sm text-gray-600">{structure.email}</p>
        </div>

        {/* ✅ Informations Lavage + QR Code */}
        <div className="border-b border-dashed pt-4 pb-4">
          <h1 className="text-xl font-bold text-blue-600 text-center mb-2">FACTURE</h1>
          
          <div className="flex justify-between items-center text-sm text-gray-700">
            <div>
              <p><strong>Date :</strong> {formatDate(lavage.created_at)}</p>
              <p><strong>Client :</strong> {lavage.client.nom} {lavage.client.prenom}</p>
              <p><strong>Email :</strong> {lavage.client.email}</p>
              <p><strong>Lavage N°:</strong> {lavage.id}</p>
              <p><strong>Réceptionné par :</strong> {acteur.nom} {acteur.prenom}</p>
              <p><strong>Kilogramme(s) (Kg) :</strong> {lavage?.kilogrammes || "non facturé"}  </p>
              
             {/* ✅ Mise en avant de la consigne */}
             <p className="text-lg font-semibold text-red-600">
                <strong>Consigne :</strong> {lavage.consigne?.nom || "Non spécifié"} -{" "}
                {lavage.consigne.type_consigne}---{lavage.consigne.priorite_consigne} ({lavage.consigne?.pourcentage_variation || 0}%)
              </p>
{/* ✅ Mise en avant du total */}
<p className="text-xl font-bold text-blue-600 mt-2">
                <strong>Total :</strong> {parseFloat(lavage.tarif_total).toFixed(2)} FCFA
              </p>

            </div>

            {/* ✅ QR Code Code Retrait */}
            <div className="ml-4">
              <QRCode value={lavage.code_retrait.toString()} size={90} />
              {/* <p className="text-center mt-2 text-gray-700 font-bold">Code Retrait</p> */}
            </div>
          </div>
        </div>

        {/* ✅ Détail des vêtements */}
        <h2 className="text-lg font-bold text-blue-600 mt-4 text-center">Détail des Vêtements</h2>
        <table className="w-full text-left border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Catégorie</th>
              <th className="border px-3 py-2">Type</th>
              <th className="border px-3 py-2">Couleur</th>
              <th className="border px-3 py-2">Prix (FCFA)</th>
              <th className="border px-3 py-2">QR Code</th>
            </tr>
          </thead>
          <tbody>
            {lavage.vetements.map((vetement, index) => (
              <tr key={vetement.id}>
                <td className="border px-3 py-2">{vetement.categorie.nom}</td>
                <td className="border px-3 py-2">{vetement.type.nom}</td>
                <td className="border px-3 py-2 text-center">
                  <div
                    className="w-4 h-4 rounded-full mx-auto"
                    style={{ backgroundColor: vetement.couleur }}
                  ></div>
                </td>
                <td className="border px-3 py-2 text-right">
        {vetement.tarif !== null && vetement.tarif !== undefined
          ? Number(vetement.tarif).toFixed(2)
          : "N/A"}
      </td>
                <td className="border px-3 py-2 text-center">
                  <div className="border-2 border-dashed p-2 inline-block rounded-lg">
                    <QRCode value={vetement.id.toString()} size={50} />
                    <p className="mt-2 font-semibold text-gray-700">
                      {index + 1}/{lavage.vetements.length}-{lavage.id}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Récapitulatif */}
        <div className="mt-4 text-right font-bold text-lg">
          <p className="text-xl font-bold text-blue-600">
            <strong>Total :</strong> {lavage.tarif_total ? parseFloat(lavage.tarif_total).toFixed(2) : "Non défini"} FCFA
          </p>
        </div>
         <button onClick={togglePaymentStatus} className="focus:outline-none">
                    {lavage.status === "Payé" ? (
                      <>
                        <FaCheckCircle className="text-2xl text-green-500" />
                        <span className="text-green-500 font-semibold">Payé</span> 
                      </>

                    ) : (
                      <>
                        <FaTimesCircle className="text-2xl text-red-500" />
                        <span className="text-red-500 font-semibold">Non Payé</span>
                        
                      </>
                    )}
                </button>
        {/* ✅ Bouton Imprimer */}
        <div className="mt-4 print:hidden text-center">
          <button
            onClick={handlePrintAndUpdate}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          >
            Imprimer et Mettre à Jour
          </button>
        </div>
      </div>

    </LayoutReceptionniste>
  );
};


export default Facture;
