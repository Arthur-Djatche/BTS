import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { usePage } from "@inertiajs/react";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import { Inertia } from "@inertiajs/inertia";
import { toast } from "react-toastify";
import { FaMoneyBillWave, FaPrint, FaSave, FaTrash } from "react-icons/fa";

const Facture = () => {
  const { lavage, structure, acteur } = usePage().props;
  const [isMobile, setIsMobile] = useState(false);

  // Détection de la taille de l'écran
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!lavage || !structure || !acteur) {
    return (
      <LayoutReceptionniste>
        <div className="p-6 text-center">Chargement en cours...</div>
      </LayoutReceptionniste>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleDelete = () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce lavage ?")) return;
    
    Inertia.delete(`/lavages/${lavage.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Lavage supprimé avec succès !");
        Inertia.visit("/receptionniste/nouveau-lavage");
      },
      onError: () => toast.error("Erreur lors de la suppression")
    });
  };

  const togglePaymentStatus = async () => {
    await Inertia.post(`/lavages/${lavage.id}/toggle-status`, {}, {
      preserveScroll: true,
      onSuccess: () => toast.success("Statut de paiement mis à jour"),
      onError: () => toast.error("Erreur lors de la mise à jour")
    });
  };

  const handlePrintAndUpdate = () => {
    if (!lavage?.vetements) {
      toast.error("Données de lavage indisponibles !");
      return;
    }

    lavage.vetements.forEach((vetement) => {
      const nouvelEtat = lavage.consigne?.type_consigne === "Repassage_Simple" 
        ? "En repassage" 
        : "En lavage";

      Inertia.patch(`/vetements/${vetement.id}/update-etat`, {
        etat: nouvelEtat
      }, {
        onError: () => toast.error(`Erreur sur le vêtement ${vetement.id}`)
      });
    });

    window.print();
    Inertia.visit('/receptionniste/nouveau-lavage')
  };

  const handlePayAndPrint = async () => {
    await togglePaymentStatus();
    handlePrintAndUpdate();
  };

  return (
    <LayoutReceptionniste className="print:hidden">
      <div className={`p-4 md:p-6 bg-white rounded-lg shadow-md mx-auto ${isMobile ? 'w-full' : 'max-w-3xl'} print:max-w-full print:shadow-none`}>
        {/* En-tête */}
        <div className="text-center mb-4 border-b border-dashed pb-4">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 flex items-center justify-center rounded-full">
              <span className="text-gray-500 text-xs">LOGO</span>
            </div>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-700">{structure.nom_structure}</h2>
          <p className="text-sm text-gray-600">{structure.ville} - {structure.telephone}</p>
          <p className="text-sm text-gray-600">{structure.email}</p>
          <h1 className="text-xl md:text-2xl font-bold text-blue-600 mt-2">FACTURE #{lavage.id}</h1>
        </div>

        {/* Informations client et QR code */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="space-y-2 text-sm">
            <p><strong>Date :</strong> {formatDate(lavage.created_at)}</p>
            <p><strong>Client :</strong> {lavage.client.nom} {lavage.client.prenom}</p>
            <p><strong>Email :</strong> {lavage.client.email}</p>
            <p><strong>Réceptionné par :</strong> {acteur.nom} {acteur.prenom}</p>
            {lavage.kilogrammes && (
              <p><strong>Kilogramme(s) :</strong> {lavage.kilogrammes} kg</p>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            <QRCode 
              value={lavage.code_retrait.toString()} 
              size={isMobile ? 80 : 90} 
              className="mb-2"
            />
            <span className="text-xs font-semibold">Code retrait</span>
          </div>
        </div>

        {/* Consigne et total */}
        <div className="mb-6">
          <div className="bg-red-50 p-3 rounded-lg border border-red-100 mb-3">
            <p className="text-lg font-semibold text-red-600">
              <strong>Consigne :</strong> {lavage.consigne?.nom || "Non spécifié"} -{" "}
              {lavage.consigne?.type_consigne} (Priorité: {lavage.consigne?.priorite_consigne})
            </p>
            <p className="text-sm">Variation: {lavage.consigne?.pourcentage_variation || 0}%</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xl font-bold text-blue-600">
              <strong>Total :</strong> {parseFloat(lavage.tarif_total || 0).toFixed(2)} FCFA
            </p>
          </div>
        </div>

        {/* Détail des vêtements */}
        <h2 className="text-lg font-bold text-blue-600 mb-3 text-center">Détail des Vêtements</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left border">Catégorie</th>
                <th className="p-2 text-left border">Type</th>
                <th className="p-2 text-center border">Couleur</th>
                <th className="p-2 text-right border">Prix (FCFA)</th>
                <th className="p-2 text-center border">Étiquette</th>
              </tr>
            </thead>
            <tbody>
              {lavage.vetements.map((vetement, index) => (
                <tr key={vetement.id} className="border-b">
                  <td className="p-2 border">{vetement.categorie.nom}</td>
                  <td className="p-2 border">{vetement.type.nom}</td>
                  <td className="p-2 border text-center">
                    <div 
                      className="w-4 h-4 rounded-full mx-auto border border-gray-300"
                      style={{ backgroundColor: vetement.couleur }}
                    />
                  </td>
                  <td className="p-2 border text-right">
                    {vetement.tarif ? parseFloat(vetement.tarif).toFixed(2) : "0.00"}
                  </td>
                  <td className="p-2 border text-center">
                    <div className="border-2 border-dashed border-gray-400 p-1 inline-block rounded">
                      <QRCode 
                        value={vetement.id.toString()} 
                        size={isMobile ? 40 : 50} 
                      />
                      <p className="text-xs font-semibold mt-1">
                        {index + 1}/{lavage.vetements.length}-{lavage.id}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Boutons d'action */}
        <div className="mt-6 print:hidden flex flex-wrap gap-3 justify-center">
          <button
            onClick={handlePayAndPrint}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <FaMoneyBillWave /> Payer
          </button>
          
          <button
            onClick={handlePrintAndUpdate}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
          >
            <FaPrint /> Exécuter
          </button>
          
          <button
            onClick={() => Inertia.visit('/receptionniste/nouveau-lavage')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <FaSave /> Conserver
          </button>
          
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <FaTrash /> Supprimer
          </button>
        </div>

        {/* Pied de page pour l'impression */}
        <div className="mt-8 text-center text-xs text-gray-500 print:block hidden">
          <p>Merci pour votre confiance - {structure.nom_structure}</p>
          <p>{structure.ville} - {structure.telephone} - {structure.email}</p>
          <p>Facture générée le {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </LayoutReceptionniste>
  );
};

export default Facture;