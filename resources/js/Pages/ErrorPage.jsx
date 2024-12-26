import React from 'react';

export default function ErrorPopup({ message, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}
