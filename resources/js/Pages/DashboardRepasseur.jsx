import React from "react";
import LayoutRepasseur from "@/Layouts/LayoutRepasseur";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardRepasseur({ en_repassage, repasses, stats_journalieres }) {
  const labels = stats_journalieres.map(entry => entry.date);
  const data = stats_journalieres.map(entry => entry.total);

  const barData = {
    labels,
    datasets: [
      {
        label: "Vêtements lavés par jour",
        data,
        backgroundColor: "#3b82f6",
      }
    ]
  };

  return (
    <LayoutRepasseur>
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Tableau de Bord du Repasseur</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-gray-700">En cours de repassage</h2>
          <p className="text-3xl font-bold text-blue-600 mt-4">{en_repassage}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-gray-700">Déjà repassés</h2>
          <p className="text-3xl font-bold text-green-600 mt-4">{repasses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total des 7 derniers jours</h2>
          <p className="text-3xl font-bold text-purple-600 mt-4">{data.reduce((a, b) => a + b, 0)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Statistiques des Lavages (7 derniers jours)</h2>
        <Bar data={barData} />
      </div>
    </LayoutRepasseur>
  );
}
