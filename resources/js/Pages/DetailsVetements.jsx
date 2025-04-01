import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DetailsVetements = () => {
  const { lavage } = usePage().props;
  const [isMobile, setIsMobile] = React.useState(false);

  // Détection de la taille de l'écran
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRetirerVetement = (vetementId) => {
    if (window.confirm("Êtes-vous sûr de vouloir marquer ce vêtement comme retiré ?")) {
      Inertia.post(`/vetements/${vetementId}/retirer`, {}, {
        onSuccess: () => toast.success("Vêtement marqué comme retiré"),
        onError: () => toast.error("Erreur lors du retrait"),
      });
    }
  };

  // Version mobile - Carte par vêtement
  const MobileView = () => (
    <div className="space-y-4">
      {lavage.vetements.map((vetement) => (
        <div key={vetement.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-blue-600">Vêtement #{vetement.id}</h3>
              <p className="text-gray-700">{vetement.categorie.nom} - {vetement.type.nom}</p>
            </div>
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: vetement.couleur }}
              ></div>
              <span className={`px-2 py-1 rounded text-xs text-white ${
                vetement.etat === "Terminé" ? "bg-green-500" : 
                vetement.etat === "Retiré" ? "bg-gray-500" : "bg-yellow-500"
              }`}>
                {vetement.etat}
              </span>
            </div>
          </div>

          {vetement.etat === "Terminé" && (
            <button
              onClick={() => handleRetirerVetement(vetement.id)}
              className="w-full mt-3 bg-green-500 text-white py-2 rounded text-sm"
            >
              Marquer comme retiré
            </button>
          )}
        </div>
      ))}
    </div>
  );

  // Version desktop - Tableau
  const DesktopView = () => (
    <table className="w-full text-left border-collapse">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">ID</th>
          <th className="p-3">Catégorie</th>
          <th className="p-3">Type</th>
          <th className="p-3">Couleur</th>
          <th className="p-3">État</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {lavage.vetements.map((vetement) => (
          <tr key={vetement.id} className="hover:bg-gray-50 border-t">
            <td className="p-3">{vetement.id}</td>
            <td className="p-3">{vetement.categorie.nom}</td>
            <td className="p-3">{vetement.type.nom}</td>
            <td className="p-3">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: vetement.couleur }}
                ></div>
                {vetement.couleur}
              </div>
            </td>
            <td className="p-3">
              <span className={`px-2 py-1 rounded text-xs text-white ${
                vetement.etat === "Terminé" ? "bg-green-500" : 
                vetement.etat === "Retiré" ? "bg-gray-500" : "bg-yellow-500"
              }`}>
                {vetement.etat}
              </span>
            </td>
            <td className="p-3">
              {vetement.etat === "Terminé" && (
                <button
                  onClick={() => handleRetirerVetement(vetement.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  Retirer
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <LayoutReceptionniste>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">
            Détails du Lavage #{lavage.id}
          </h1>
          <h2 className="text-gray-700">
            Client: <span className="font-medium">{lavage.client.nom}</span>
            {lavage.client.email && (
              <span className="text-gray-500 text-sm ml-2">({lavage.client.email})</span>
            )}
          </h2>
        </div>

        {isMobile ? <MobileView /> : <DesktopView />}
      </div>
    </LayoutReceptionniste>
  );
};

export default DetailsVetements;