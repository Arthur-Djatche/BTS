import React from "react";
import { usePage } from "@inertiajs/react";
import { Bar, Pie } from "react-chartjs-2";
import LayoutAdmin from '@/Layouts/LayoutAdmin';
import "chart.js/auto";

const DashboardStructure = () => {
  const { stats, charts } = usePage().props;

  // 📊 Lavages par Mois
  const lavagesParMoisData = {
    labels: charts.lavagesParMois
      ? Object.keys(charts.lavagesParMois).map((mois) =>
          new Date(2024, mois - 1, 1).toLocaleString("fr-FR", { month: "long" })
        )
      : [],
    datasets: [
      {
        label: "Nombre de Lavages",
        data: charts.lavagesParMois ? Object.values(charts.lavagesParMois) : [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 📊 Lavages par Type de Consigne
  const lavagesParConsigneData = {
    labels: charts.lavagesParConsigne.map((item) => item.nom),
    datasets: [
      {
        label: "Répartition des Consignes",
        data: charts.lavagesParConsigne.map((item) => item.total),
        backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0"],
      },
    ],
  };

  return (
    <LayoutAdmin>
      <div className="p-6">
        {/* 📌 Stats générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow p-4 rounded-lg text-center">
            <h3 className="text-lg font-bold text-gray-700">Lavages Aujourd'hui</h3>
            <p className="text-2xl font-semibold text-blue-600">{stats.lavagesAujourdhui}</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg text-center">
            <h3 className="text-lg font-bold text-gray-700">Vêtements Traités</h3>
            <p className="text-2xl font-semibold text-green-500">{stats.vetementsAujourdhui}</p>
          </div>
        </div>

        {/* 📊 Graphiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold text-gray-700">Lavages par Mois</h2>
            <Bar data={lavagesParMoisData} />
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold text-gray-700">Répartition des Consignes</h2>
            <Pie data={lavagesParConsigneData} />
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default DashboardStructure;
