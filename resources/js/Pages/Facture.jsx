import React from "react";
import QRCode from "react-qr-code";
import { usePage } from "@inertiajs/react";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import Layout from "@/Layouts/Layout";
import { Inertia } from "@inertiajs/inertia";

const Facture = () => {
  const { lavage, structure, acteur } = usePage().props;

  const handlePrintAndUpdate = () => {
    lavage.vetements.forEach((vetement) => {
      Inertia.patch(`/vetements/${vetement.id}/update-etat`, {
        etat: "En lavage",
      });
    });
    window.print();
    Inertia.visit(`/receptionniste/nouveau-lavage`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!lavage) {
    return <p>Chargement...</p>;
  }

  const { id, client, vetements, created_at, code_retrait } = lavage;

  return (
    <LayoutReceptionniste className="print:hidden">
 
 <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto print:max-w-full border">
      {/* Logo et Infos Structure */}
      <div className="text-center mb-4">
        <div className="flex justify-center mb-2">
          {/* Espace pour le logo */}
          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-full">
            <span className="text-gray-500 text-xs">LOGO</span>
          </div>
        </div>
        <h2 className="text-lg font-bold text-gray-700">{structure.nom_structure}</h2>
        <p className="text-sm text-gray-600">{structure.ville} - {structure.telephone}</p>
        <p className="text-sm text-gray-600">{structure.email}</p>
      </div>

      {/* Détails de la Facture */}
      <div className="border-b border-dashed pt-4">
        <h1 className="text-xl font-bold text-blue-600 text-center mb-2">FACTURE</h1>
        
        {/* Informations Client & Lavage + QR Code en ligne */}
<div className="flex justify-between items-center text-sm text-gray-700 mt-4 mb-8">
  {/* Infos Client & Lavage (à gauche) */}
  <div>
    <p><span className="font-semibold">Date :</span> {formatDate(lavage.created_at)}</p>
    <p>
      <span className="font-semibold">Client :</span> {lavage.client.nom} {lavage.client.prenom} 
      <br /> ({lavage.client.email})
    </p>
    <p><span className="font-semibold">No Lavage :</span> {lavage.id}</p>
    <p><span className="font-semibold">Nombre de vêtements :</span> {lavage.vetements.length}</p>
    <p><span className="font-semibold"> Receptionné par:</span> {acteur.nom} {acteur.prenom}</p>
  </div>
  

  {/* QR Code (à droite) */}
  <div className="ml-4">
    <QRCode value={lavage.code_retrait.toString()} size={90} />
  </div>
</div>
      </div>
    

        <h2 className="text-lg font-bold text-blue-600 mb-2 text-center">Détail des vêtements</h2>
        <table className="w-full text-left border-collapse border border-gray-300 text-sm">
  <thead>
    <tr>
      <th className="border px-2 py-1">Catégorie</th>
      <th className="border px-2 py-1">Type</th>
      <th className="border px-2 py-1">Couleur</th>
      <th className="border px-2 py-1">QR Code</th>
    </tr>
  </thead>
  <tbody>
    {vetements.map((vetement, index) => (
      <tr key={vetement.id}>
        <td className="border px-2 py-1">{vetement.categorie.nom}</td>
        <td className="border px-2 py-1">{vetement.type.nom}</td>
        <td className="border px-2 py-1">
          <div
            className="w-4 h-4 rounded-full mx-auto"
            style={{ backgroundColor: vetement.couleur }}
          ></div>
        </td>
        <td className="border px-2 py-1 text-center">
          <div className="border-2 border-dashed p-2 inline-block rounded-lg">
            {/* QR Code unique pour chaque vêtement */}
            <QRCode value={vetement.id.toString()} size={50} />

            {/* Numéro du vêtement dans l'ordre - ID du lavage */}
            <p className="mt-2 font-semibold text-gray-700">
              {index + 1}/{lavage.vetements.length}-{lavage.id}
            </p>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>


        {/* Bouton masqué lors de l'impression */}
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

Facture.layout = (page) => <Layout children={page} />;
export default Facture;
