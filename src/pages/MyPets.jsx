import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets } from "../Reducer/PetSlice";
import Loader from "../components/Loader";
import PetCard from "../components/PetCard";

const MyPets = () => {
  const dispatch = useDispatch();
  const { pets, loading, error } = useSelector((state) => state.pets);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  const filtered = pets.filter((pet) =>
    `${pet.name} ${pet.breed || ""} ${pet.petId}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && pets.length === 0) return <Loader text="Loading your pets..." />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>My pets</h1>
          <p className="muted">{pets.length} registered</p>
        </div>
        <Link to="/pets/add" className="btn btn-primary">
          + Add pet
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {pets.length > 0 && (
        <input
          className="search-input"
          placeholder="Search by name, breed or Pet ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {pets.length === 0 ? (
        <div className="card empty">
          <span className="empty-icon">🐾</span>
          <h3>No pets yet</h3>
          <p className="muted">Add a pet to get a QR tag for its collar.</p>
          <Link to="/pets/add" className="btn btn-primary">
            Add a pet
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="muted">No pets match "{search}".</p>
      ) : (
        <div className="pet-grid">
          {filtered.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      )}
    </>
  );
};

export default MyPets;