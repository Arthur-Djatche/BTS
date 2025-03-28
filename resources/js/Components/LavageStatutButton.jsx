import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const LavageStatusButton = ({ lavage, onToggleStatus }) => {
    return (
        <button onClick={onToggleStatus} className="focus:outline-none">
            {lavage.status === "Payé" ? (
                <FaCheckCircle className="text-2xl text-green-500" />
            ) : (
                <FaTimesCircle className="text-2xl text-red-500" />
            )}
        </button>
    );
};

export default LavageStatusButton;
