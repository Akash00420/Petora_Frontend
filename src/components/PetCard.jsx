import { Link } from "react-router-dom";
import { fileUrl, speciesEmoji } from "../utils/helpers";

const PetCard = ({ pet }) => (
  <article className={`pet-card${pet.isLost ? " is-lost" : ""}`}>
    <div className="pet-card-photo">
      {pet.photo ? (
        <img src={fileUrl(pet.photo)} alt={pet.name} />
      ) : (
        <span className="pet-emoji">{speciesEmoji(pet.species)}</span>
      )}
      {pet.isLost && <span className="badge badge-danger">LOST</span>}
    </div>

    <div className="pet-card-body">
      <h3>{pet.name}</h3>
      <p className="muted">
        {pet.species}
        {pet.breed ? ` · ${pet.breed}` : ""}
      </p>
      <span className="pet-code">{pet.petId}</span>

      <div className="card-actions">
        <Link className="btn btn-primary btn-sm" to={`/pets/${pet._id}`}>
          View
        </Link>
        <Link className="btn btn-outline btn-sm" to={`/pets/${pet._id}/qr`}>
          QR
        </Link>
      </div>
    </div>
  </article>
);

export default PetCard;