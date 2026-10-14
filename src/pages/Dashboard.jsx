import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets } from "../Reducer/PetSlice";
import { fetchMyLostReports } from "../Reducer/LostSlice";
import { findActiveReport } from "../utils/helpers";
import Loader from "../components/Loader";
import LostPetBanner from "../components/LostPetBanner";
import PetCard from "../components/PetCard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { pets, loading } = useSelector((state) => state.pets);
  const { myReports } = useSelector((state) => state.lost);

  useEffect(() => {
    dispatch(fetchPets());
    dispatch(fetchMyLostReports());
  }, [dispatch]);

  const lostPets = pets.filter((p) => p.isLost);
  const resolvedCount = myReports.filter((r) => r.status === "resolved").length;

  if (loading && pets.length === 0) return <Loader text="Loading your dashboard..." />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Hello, {user?.name?.split(" ")[0] || "there"} 👋</h1>
          <p className="muted">Here's how your pets are doing.</p>
        </div>
        <Link to="/pets/add" className="btn btn-primary">
          + Add pet
        </Link>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <span className="stat-value">{pets.length}</span>
          <span className="muted">Pets registered</span>
        </div>
        <div className="card stat-card">
          <span className={`stat-value${lostPets.length ? " danger" : ""}`}>{lostPets.length}</span>
          <span className="muted">Currently lost</span>
        </div>
        <div className="card stat-card">
          <span className="stat-value">{resolvedCount}</span>
          <span className="muted">Reunited</span>
        </div>
      </div>

      {lostPets.map((pet) => (
        <LostPetBanner key={pet._id} pet={pet} report={findActiveReport(myReports, pet._id)}>
          <Link to={`/pets/${pet._id}`}>Open profile</Link>
        </LostPetBanner>
      ))}

      <div className="section-title">
        <h2>Your pets</h2>
        {pets.length > 4 && <Link to="/pets">View all</Link>}
      </div>

      {pets.length === 0 ? (
        <div className="card empty">
          <span className="empty-icon">🐶</span>
          <h3>No pets yet</h3>
          <p className="muted">Add your first pet to generate its QR tag.</p>
          <Link to="/pets/add" className="btn btn-primary">
            Add your first pet
          </Link>
        </div>
      ) : (
        <div className="pet-grid">
          {pets.slice(0, 4).map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      )}
    </>
  );
};

export default Dashboard;