import { Link } from "react-router-dom";
import { QrCode } from "lucide-react";
import { fileUrl, speciesEmoji } from "../utils/helpers";

const PetCard = ({ pet }) => (
  <article className={`pc-card ${pet.isLost ? "is-lost" : ""}`}>
    <div className="pc-photo">
      {pet.photo ? (
        <img src={fileUrl(pet.photo)} alt={pet.name} />
      ) : (
        <span className="pet-emoji">{speciesEmoji(pet.species)}</span>
      )}
      <span className={`pc-status ${pet.isLost ? "lost" : "safe"}`}>
        {pet.isLost ? "Lost" : "Safe at Home"}
      </span>
    </div>

    <div className="pc-body">
      <h3>{pet.name}</h3>
      <p className="pc-meta">
        {pet.species}
        {pet.breed ? ` · ${pet.breed}` : ""}
      </p>
      <span className="pc-code">{pet.petId}</span>

      <div className="pc-actions">
        <Link to={`/pets/${pet._id}`} className="btn btn-primary">
          View
        </Link>
        <Link to={`/pets/${pet._id}/qr`} className="btn btn-outline">
          <QrCode size={13} /> QR
        </Link>
      </div>
    </div>
  </article>
);

export default PetCard;