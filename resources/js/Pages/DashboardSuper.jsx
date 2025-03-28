import React from "react";
import { usePage } from "@inertiajs/react";
import { Bar, Pie } from "react-chartjs-2";
import LayoutSuper from "@/Layouts/LayoutSuper";
import "chart.js/auto";

const Dashboard = () => {
  const { stats, charts } = usePage().props;

  // 📊 Données du graphique des structures inscrites par mois
  const dataStructuresMois = {
    labels: charts.structuresParMois
      ? Object.keys(charts.structuresParMois).map((mois) =>
          new Date(2024, mois - 1, 1).toLocaleString("fr-FR", { month: "long" })
        )
      : [],
    datasets: [
      {
        label: "Structures inscrites",
        data: charts.structuresParMois ? Object.values(charts.structuresParMois) : [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <LayoutSuper>
      <div className="p-6">
        {/* 📌 Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow p-4 rounded-lg text-center">
            <h3 className="text-lg font-bold text-gray-700">Total Structures</h3>
            <p className="text-2xl font-semibold text-blue-600">{stats.totalStructures}</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg text-center">
            <h3 className="text-lg font-bold text-gray-700">Total Employés</h3>
            <p className="text-2xl font-semibold text-green-500">{stats.totalEmployes}</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg text-center">
            <h3 className="text-lg font-bold text-gray-700">Structure la plus active</h3>
            <p className="text-2xl font-semibold text-orange-500">{stats.structureTop}</p>
          </div>
        </div>

        {/* 📊 Graphiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold text-gray-700">Structures inscrites par mois</h2>
            <Bar data={dataStructuresMois} />
          </div>
        </div>
      </div>
    </LayoutSuper>
  );
};

export default Dashboard;
