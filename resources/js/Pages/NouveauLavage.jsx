import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/inertia-react";
import { usePage } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";

const NouveauLavage = () => {
  const [nomClient, setNomClient] = useState("");
  const [nombreVetements, setNombreVetements] = useState(1);
  const [vetements, setVetements] = useState([{ categorie_id: "", type_id: "", couleur: "#000000" }]);
  const [facture, setFacture] = useState(null); // Facture pour la deuxième étape
  const { clients, categories, types } = usePage().props;

  useEffect(() => {
    const difference = nombreVetements - vetements.length;
    if (difference > 0) {
      setVetements((prev) => [
        ...prev,
        ...Array(difference).fill({ categorie_id: "", type_id: "", couleur: "#000000" }),
      ]);
    } else if (difference < 0) {
      setVetements((prev) => prev.slice(0, nombreVetements));
    }
  }, [nombreVetements]);

  const handleVetementChange = (index, field, value) => {
    const updatedVetements = vetements.map((vetement, i) =>
      i === index ? { ...vetement, [field]: value } : vetement
    );
    setVetements(updatedVetements);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Générer une facture temporaire pour l'étape suivante
    const numeroLavage = Date.now(); // Exemple de numéro unique basé sur l'heure
    const factureTemp = {
      client: nomClient,
      vetements: vetements.map((v, index) => ({
        ...v,
        numero: `${numeroLavage}-${index + 1}`,
        codeBarre: `${numeroLavage}${index + 1}`, // Exemple de code-barres
      })),
    };
    setFacture(factureTemp); // Passer à l'étape de la facture
  };

  const handlePrintAndSave = () => {
    // Insérer les données dans la base de données
    Inertia.post("/lavages", {
      client: facture.client,
      vetements: facture.vetements,
    });

    // Imprimer la facture
    window.print();
  };

  if (facture) {
    // Étape 2 : Affichage de la facture
    return (
      <LayoutReceptionniste>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">Facture</h1>
          <p className="text-blue-500">Client : {facture.client}</p>
          <table className="w-full text-left border-collapse border border-blue-300 mt-4">
            <thead>
              <tr>
                <th className="border border-blue-300 px-4 py-2">Numéro</th>
                <th className="border border-blue-300 px-4 py-2">Catégorie</th>
                <th className="border border-blue-300 px-4 py-2">Type</th>
                <th className="border border-blue-300 px-4 py-2">Couleur</th>
                <th className="border border-blue-300 px-4 py-2">Code-barres</th>
              </tr>
            </thead>
            <tbody>
              {facture.vetements.map((vetement, index) => (
                <tr key={index}>
                  <td className="border border-blue-300 px-4 py-2">{vetement.numero}</td>
                  <td className="border border-blue-300 px-4 py-2">
                    {categories.find((c) => c.id === vetement.categorie_id)?.nom || "N/A"}
                  </td>
                  <td className="border border-blue-300 px-4 py-2">
                    {types.find((t) => t.id === vetement.type_id)?.nom || "N/A"}
                  </td>
                  <td className="border border-blue-300 px-4 py-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: vetement.couleur }}
                    ></div>
                  </td>
                  <td className="border border-blue-300 px-4 py-2">
                    <img
                      src={`https://barcode.tec-it.com/barcode.ashx?data=${vetement.codeBarre}&code=Code128`}
                      alt={`Code-barres ${vetement.codeBarre}`}
                      className="w-32"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handlePrintAndSave}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          >
            Imprimer et Enregistrer
          </button>
        </div>
      </LayoutReceptionniste>
    );
  }

  // Étape 1 : Formulaire de lavage
  return (
    <LayoutReceptionniste>
      
        <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Nouveau Lavage</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Zone de recherche du client */}
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <label className="block text-blue-600 font-medium mb-1">Nom du client</label>
              <input
                type="text"
                className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nomClient}
                onChange={(e) => setNomClient(e.target.value)}
                list="clients"
                placeholder="Rechercher un client..."
              />
              <datalist id="clients">
                {clients.map((client) => (
                  <option key={client.id} value={client.nom} />
                ))}
              </datalist>
            </div>
            <Link
              href="/clients/create"
              className="mt-7 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
            >
              Ajouter Client
            </Link>
          </div>

          {/* Nombre de vêtements */}
          <div>
            <label className="block text-blue-600 font-medium mb-1">Nombre de vêtements</label>
            <input
              type="number"
              min="1"
              className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nombreVetements}
              onChange={(e) => setNombreVetements(Number(e.target.value))}
            />
          </div>

          {/* Liste des vêtements */}
          {vetements.map((vetement, index) => (
            <div key={index} className="border border-blue-300 rounded-lg p-4 space-y-4">
              <h2 className="font-semibold text-blue-500">Vêtement {index + 1}</h2>

              {/* Catégorie */}
              <div>
                <label className="block text-blue-600 font-medium mb-1">Catégorie</label>
                <select
                  className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={vetement.categorie_id}
                  onChange={(e) => handleVetementChange(index, "categorie_id", e.target.value)}
                >
                  <option value="">-- Sélectionner --</option>
                  {categories.map((categorie) => (
                    <option key={categorie.id} value={categorie.id}>
                      {categorie.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-blue-600 font-medium mb-1">Type</label>
                <input
                  type="text"
                  className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={vetement.type_id}
                  onChange={(e) => handleVetementChange(index, "type_id", e.target.value)}
                  list="types"
                  placeholder="Rechercher un type..."
                />
                <datalist id="types">
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.nom}
                    </option>
                  ))}
                </datalist>
              </div>

              {/* Couleur */}
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-blue-600 font-medium mb-1">Couleur</label>
                  <input
                    type="color"
                    className="w-12 h-12 border border-blue-300 rounded"
                    value={vetement.couleur}
                    onChange={(e) => handleVetementChange(index, "couleur", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Bouton Suivant */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          >
            Suivant
          </button>
        </form>
      </div>
    </LayoutReceptionniste>
  );
};

NouveauLavage.layout = (page) => <Layout children={page} />;

export default NouveauLavage;
