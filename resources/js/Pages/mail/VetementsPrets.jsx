import React from "react";

// Vue React pour l'email
const VetementsPrets = ({ lavage }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.5", color: "#333" }}>
      <h1 style={{ color: "#4CAF50" }}>Bonjour, {lavage.client.nom} !</h1>
      <p>
        Nous avons le plaisir de vous informer que tous vos vêtements associés au lavage
        <strong> #{lavage.id}</strong> sont prêts.
      </p>

      <h2>Résumé du lavage</h2>
      <ul>
        {lavage.vetements.map((vetement) => (
          <li key={vetement.id}>
            <strong>Catégorie :</strong> {vetement.categorie.nom} - 
            <strong> Type :</strong> {vetement.type.nom} - 
            <strong> Couleur :</strong> {vetement.couleur}
          </li>
        ))}
      </ul>

      <p>Vous pouvez venir les récupérer dès maintenant. Merci de votre confiance !</p>
      <p><strong>L'équipe bnr</strong></p>
    </div>
  );
};

export default VetementsPrets;
