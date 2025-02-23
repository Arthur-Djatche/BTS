import { Link } from "@inertiajs/react";
import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-2xl text-center">
        <h1 className="text-2xl font-bold text-red-600">Accès Refusé</h1>
        <p className="text-gray-600 mt-2">
          Vous n'êtes pas autorisé à accéder à cette page.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          Se Connecter
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
