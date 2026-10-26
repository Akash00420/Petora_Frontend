import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearPublicPet, fetchPublicPet } from "../Reducer/PetSlice";
import Loader from "../components/Loader";
import LostPetBanner from "../components/LostPetBanner";
import PetProfileCard from "../components/PetProfileCard";
import PetHealthCard from "../components/PetHealthCard";

// Public page opened when a QR tag is scanned: /scan/:petId
// Without a code in the URL it shows a box to type the PET-XXXXXX code manually.
const ScanPet = () => {
  const { petId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { publicPet, loading, error } = useSelector((state) => state.pets);
  const [code, setCode] = useState("");
  const fetchedFor = useRef(null);

  useEffect(() => {
    // Guard so React StrictMode doesn't log the scan twice in development
    if (petId && fetchedFor.current !== petId) {
      fetchedFor.current = petId;
      dispatch(clearPublicPet());
      dispatch(fetchPublicPet(petId));
    }
  }, [petId, dispatch]);

  const handleLookup = (e) => {
    e.preventDefault();
    const value = code.trim().toUpperCase();
    if (value) navigate(`/scan/${value}`);
  };

  if (!petId) {
    return (
      <div className="auth-wrap">
        <form className="card auth-card form" onSubmit={handleLookup}>
          <h1>Found a pet?</h1>
          <p className="muted">Enter the Pet ID printed on the tag (it looks like PET-4F7K2A).</p>

          <div className="form-group">
            <label htmlFor="code">Pet ID</label>
            <input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="PET-XXXXXX" />
          </div>

          <button className="btn btn-primary btn-block" type="submit">
            Look up pet
          </button>
        </form>
      </div>
    );
  }

  if (loading && !publicPet) return <Loader text="Looking up this pet..." />;

  if (error || !publicPet) {
    return (
      <div className="container empty">
        <span className="empty-icon">🔍</span>
        <h1>No pet found</h1>
        <p className="muted">{error || "We couldn't find a pet with this code."}</p>
        <Link to="/scan" className="btn btn-primary">
          Try another code
        </Link>
      </div>
    );
  }

  return (
    <div className="container narrow section">
      {publicPet.isLost && (
        <LostPetBanner pet={publicPet}>
          <p>This pet is missing. Please contact the owner as soon as you can.</p>
        </LostPetBanner>
      )}

      <PetProfileCard pet={publicPet} />

      {/* public safety info only: caution, medical alert (if shown on tag), vaccinations */}
      <PetHealthCard pet={publicPet} />

      {publicPet.ownerPhone ? (
        <a className="btn btn-primary btn-block btn-lg" href={`tel:${publicPet.ownerPhone}`}>
          📞 Call {publicPet.ownerName || "the owner"} — {publicPet.ownerPhone}
        </a>
      ) : (
        <div className="alert alert-error">The owner hasn't added a phone number for this pet.</div>
      )}
    </div>
  );
};

export default ScanPet;