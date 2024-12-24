import Layout from "@/Layouts/Layout";
import { useForm } from '@inertiajs/react';


export default function Register() {

  
    const { data, setData, post, processing, errors } = useForm({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
      role: '',
    });

  function handleSubmit (e) {
    e.preventDefault();
    console.log(data); // Vérifiez les données
    // Envoi des données au backend avec Inertia.post()
    post("/Inscription", data, {
      onError: (err) => {
        setErrors(err); // Laravel retourne les erreurs ici
      },
      onSuccess: () => {
        alert("Acteur créé avec succès !");
      },
    });
  };

  
    return (
        <>
             <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Formulaire avec un fond blanc, coins arrondis et ombre */}
      <form  onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        
        {/* Titre du formulaire */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Inscription</h2>

        {/* Champ pour le nom */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom">
            Nom
          </label>
          <input
            type="text"
            id="nom"
            placeholder="Entrez votre nom"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={data.nom}
          onChange={(e) => setData('nom', e.target.value)}
          />
          {errors.nom && <div>{errors.nom} </div>}
        </div>

        {/* Champ pour le prénom */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prenom">
            Prénom
          </label>
          <input
            type="text"
            id="prenom"
            placeholder="Entrez votre prénom"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={data.prenom}
          onChange={(e) => setData('prenom', e.target.value)}
          
          />
          {errors.prenom && <div>{errors.prenom} </div>}
        </div>

        {/* Champ pour l'adresse email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Entrez votre email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          />
          {errors.email && <div>{errors.email} </div>}
        </div>

        {/* Champ pour le téléphone */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
            Téléphone
          </label>
          <input
            type="tel"
            id="telephone"
            placeholder="Entrez votre numéro de téléphone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={data.telephone}
          onChange={(e) => setData('telephone', e.target.value)}
          />
          {errors.telephone && <div>{errors.telephone} </div>}
        </div>

        {/* Champ pour le mot de passe */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Entrez votre mot de passe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          />
          {errors.password && <div>{errors.password} </div>}
        </div>

        {/* Champ pour la confirmation du mot de passe */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirmation du mot de passe
          </label>
          <input
            type="password"
            name="password_confirmation"
            id="confirmPassword"
            placeholder="Confirmez votre mot de passe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          S'inscrire
        </button>
      </form>
    </div>
        </>
    );
}


Register.layout = page => <Layout children={page}/>

