import { fileUrl, speciesEmoji } from "../utils/helpers";

// Works for both the owner's full pet object and the public scan profile
const PetProfileCard = ({ pet }) => {
  const rows = [
    ["Pet ID", pet.petId],
    ["Species", pet.species],
    ["Breed", pet.breed],
    ["Age", pet.age !== undefined && pet.age !== null && pet.age !== "" ? `${pet.age} yr` : ""],
    ["Gender", pet.gender && pet.gender !== "unknown" ? pet.gender : ""],
    ["Color", pet.color],
    ["Contact phone", pet.contactPhone],
    ["Owner", pet.ownerName],
  ].filter(([, value]) => value);

  return (
    <section className="card profile-card">
      <div className="profile-photo">
        {pet.photo ? (
          <img src={fileUrl(pet.photo)} alt={pet.name} />
        ) : (
          <span className="pet-emoji">{speciesEmoji(pet.species)}</span>
        )}
      </div>

      <div className="profile-info">
        <h2>
          {pet.name} {pet.isLost && <span className="badge badge-danger">LOST</span>}
        </h2>

        <dl className="detail-list">
          {rows.map(([label, value]) => (
            <div className="detail-row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {pet.description && <p className="pet-description">{pet.description}</p>}
      </div>
    </section>
  );
};

export default PetProfileCard;