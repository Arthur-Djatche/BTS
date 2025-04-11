const RenvoyerButton = ({ lavageId, vetements, onClick }) => {
    const typeConsigne = vetements[0]?.lavage?.consigne?.type_consigne;
    const shouldEnable = shouldEnableRenvoyer(lavageId);
    
    if (typeConsigne !== 'Repassage_Simple') return null;

    return (
        <button
            onClick={() => onClick(lavageId)}
            disabled={!shouldEnable}
            className={`px-4 py-2 rounded focus:outline-none focus:ring-2 ${
                shouldEnable
                    ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
            Renvoyer
        </button>
    );
};