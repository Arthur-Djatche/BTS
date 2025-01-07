import React from "react";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import Layout from "@/Layouts/Layout";

function EtatLavage() {
  return (
    <LayoutReceptionniste>
      {/* Titre principal de la page */}
      <h1 className="text-2xl font-bold text-blue-600">État Lavage</h1>
      <p className="mt-4 text-gray-600">
        Consultez ici l'état des lavages en cours ou terminés.
      </p>

      {/* Tableau des états des lavages */}
      <table className="w-full mt-6 bg-white rounded shadow-md border border-gray-300">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Nom du client
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Vêtement
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Service
            </th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">
              Statut
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100">
            <td className="px-4 py-2 border-t">John Doe</td>
            <td className="px-4 py-2 border-t">Chemise</td>
            <td className="px-4 py-2 border-t">Repassage</td>
            <td className="px-4 py-2 border-t text-blue-600 font-semibold">
              En cours
            </td>
          </tr>
          <tr className="hover:bg-gray-100">
            <td className="px-4 py-2 border-t">Jane Smith</td>
            <td className="px-4 py-2 border-t">Pantalon</td>
            <td className="px-4 py-2 border-t">Nettoyage</td>
            <td className="px-4 py-2 border-t text-green-600 font-semibold">
              Terminé
            </td>
          </tr>
        </tbody>
      </table>
    </LayoutReceptionniste>
  );
}

EtatLavage.layout = (page) => <Layout children={page}/>

export default EtatLavage;
