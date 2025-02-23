import Layout from "@/Layouts/Layout";
import { useForm, Link } from "@inertiajs/react";
function Login() {

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',

  });

function handleSubmit (e) {
  e.preventDefault();
  console.log(data); // Vérifiez les données
  // Envoi des données au backend avec Inertia.post()
  post("/", data, {
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
        
         <div className="flex items-center justify-center min-h-screen bg-gray-100">
    
            <form  onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
     
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Connexion</h2>

      
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

        {/* Champ pour le mot de passe */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Mot de passe
          </label>
          {/* Champ de saisie pour le mot de passe avec du style */}
          <input
            type="password"
            id="password"
            placeholder="Entrez votre mot de passe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
          />
          {errors.password && <div>{errors.password} </div>}
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          disabled={processing}
        >
          Se connecter
        </button>
        <Link href="/Inscription"
        class="ml-8 underline ">s'inscrire / completez votre inscription </Link>
      </form>
      
    </div>
        </>
    );
}

Login.layout = page => <Layout children={page}/>


export default Login;