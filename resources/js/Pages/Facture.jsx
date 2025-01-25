import React, { useState, useEffect } from "react";
import Barcode from "react-barcode"; // Pour générer les codes-barres
import { usePage } from "@inertiajs/react"; // Pour accéder aux données envoyées par le backend via Inertia
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import Layout from "@/Layouts/Layout";

const Facture = () => {
  // Stocke les données du dernier lavage
  const { lavage } = usePage().props; // Récupération des données injectées par Inertia

  // Fonction pour formater la date au format lisible
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Si les données du lavage ne sont pas encore disponibles, afficher un message de chargement
  if (!lavage) {
    return <p>Chargement...</p>;
  }

  // Extraction des informations du lavage
  const { id, client, vetements, created_at } = lavage;

  return (
    <LayoutReceptionniste>
      <div className="p-6 bg-white rounded-lg shadow-md">
        {/* Partie supérieure de la facture */}
        <div className="border-b-2 border-dashed pb-4 mb-4">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">Facture</h1>
          {/* Date du lavage */}
          <p className="text-blue-600">
            <strong>Date :</strong> {formatDate(created_at)}
          </p>
          {/* Informations du client */}
          <p className="text-blue-600">
            <strong>Client :</strong> {client.nom} ({client.email})
          </p>
          {/* Nombre total de vêtements */}
          <p className="text-blue-600">
            <strong>Nombre de vêtements :</strong> {vetements.length}
          </p>
          {/* ID du lavage avec un code-barres */}
          <p className="text-blue-600">
            <strong>ID Lavage :</strong> {id}
          </p>
          <div className="mt-2">
            {/* Génération du code-barres pour l'ID du lavage */}
            <Barcode value={id.toString()} width={2} height={50} />
          </div>
        </div>

        {/* Partie inférieure : Liste des vêtements */}
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-4">
            Détail des vêtements
          </h2>
          <table className="w-full text-left border-collapse border border-blue-300 mb-4">
            <thead>
              <tr>
                <th className="border border-blue-300 px-4 py-2">Catégorie</th>
                <th className="border border-blue-300 px-4 py-2">Type</th>
                <th className="border border-blue-300 px-4 py-2">Couleur</th>
                <th className="border border-blue-300 px-4 py-2">Code-barres</th>
              </tr>
            </thead>
            <tbody>
              {vetements.map((vetement) => (
                <tr key={vetement.id}>
                  {/* Catégorie du vêtement */}
                  <td className="border border-blue-300 px-4 py-2">
                    {vetement.categorie.nom}
                  </td>
                  {/* Type du vêtement */}
                  <td className="border border-blue-300 px-4 py-2">
                    {vetement.type.nom}
                  </td>
                  {/* Couleur du vêtement */}
                  <td className="border border-blue-300 px-4 py-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: vetement.couleur }}
                    ></div>
                  </td>
                  {/* Code-barres généré pour l'ID du vêtement */}
                  <td className="border border-blue-300 px-4 py-2">
                    <Barcode value={vetement.id.toString()} width={2} height={50} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bouton pour imprimer la facture */}
        <button
          onClick={() => window.print()}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        >
          Imprimer la facture
        </button>
      </div>
    </LayoutReceptionniste>
  );
};
Facture.layout = (page) => <Layout children={page} />;
export default Facture;
