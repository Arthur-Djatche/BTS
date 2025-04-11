import React from "react";
import LayoutReceptionniste from "@/Layouts/LayoutReceptionniste";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function DashboardReceptionniste({ lavages_en_cours, lavages_termines, total_tarifs, vetements_etiquettage = 0 }) {
  const pieData = {
    labels: ["Lavages Non Payés", "Lavages Payés"],
    datasets: [
      {
        label: "Statut des Lavages",
        data: [lavages_en_cours, lavages_termines],
        backgroundColor: ["#f87171", "#34d399"],
        borderColor: ["#f87171", "#34d399"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["Revenus générés"],
    datasets: [
      {
        label: "FCFA",
        data: [total_tarifs],
        backgroundColor: "#6366f1",
      },
    ],
  };

  return (
    <LayoutReceptionniste>
      <div className="h-screen overflow-hidden flex flex-col px-6 py-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Dashboard Réceptionniste</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de vos lavages et revenus.</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 flex-shrink-0">
          <StatCard label="Lavages Non Payés" value={lavages_en_cours} color="text-blue-600" />
          <StatCard label="Lavages Payés" value={lavages_termines} color="text-green-600" />
          <StatCard label="Revenus Totaux" value={`${total_tarifs} FCFA`} color="text-purple-600" />
          <StatCard label="Étiquettage en attente" value={vetements_etiquettage} color="text-yellow-500" />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 flex-grow overflow-hidden">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-center">
            <h3 className="text-center font-semibold text-gray-700 mb-2">Répartition des Lavages</h3>
            <div className="h-56">
              <Pie data={pieData} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-center">
            <h3 className="text-center font-semibold text-gray-700 mb-2">Total des Revenus</h3>
            <div className="h-56">
              <Bar data={barData} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-4 justify-start">
          <a
            href="/receptionniste/nouveau-lavage"
            className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            Nouveau Lavage
          </a>
          <a
            href="/receptionniste/etat-lavage"
            className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            État Lavage
          </a>
        </div>
      </div>
    </LayoutReceptionniste>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded shadow p-4 text-center">
      <h2 className="text-sm text-gray-600 font-semibold">{label}</h2>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}
