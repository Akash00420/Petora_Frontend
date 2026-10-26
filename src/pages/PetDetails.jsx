import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePet, fetchPet } from "../Reducer/PetSlice";
import { fetchMyLostReports, resolveLostReport } from "../Reducer/LostSlice";
import { fetchScanHistory } from "../Reducer/ScanSlice";
import { deviceLabel, findActiveReport, formatDateTime, thunkError } from "../utils/helpers";
import Loader from "../components/Loader";
import LostPetBanner from "../components/LostPetBanner";
import PetProfileCard from "../components/PetProfileCard";
import PetHealthCard from "../components/PetHealthCard";

const PetDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: pet, error } = useSelector((state) => state.pets);
  const { myReports } = useSelector((state) => state.lost);
  const { scans } = useSelector((state) => state.scans);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    dispatch(fetchPet(id));
    dispatch(fetchMyLostReports());
    dispatch(fetchScanHistory(id));
  }, [dispatch, id]);

  if (!pet || pet._id !== id) {
    return error ? <div className="alert alert-error">{error}</div> : <Loader text="Loading pet..." />;
  }

  const report = pet.isLost ? findActiveReport(myReports, pet._id) : null;

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${pet.name}? This can't be undone.`)) return;
    setBusy(true);
    try {
      await dispatch(deletePet(id)).unwrap();
      navigate("/pets");
    } catch (err) {
      setActionError(thunkError(err));
      setBusy(false);
    }
  };

  const handleFound = async () => {
    if (!report) return;
    setBusy(true);
    setActionError("");
    try {
      await dispatch(resolveLostReport(report._id)).unwrap();
      await dispatch(fetchPet(id));
      dispatch(fetchMyLostReports());
    } catch (err) {
      setActionError(thunkError(err));
    }
    setBusy(false);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{pet.name}</h1>
          <p className="muted">
            <Link to="/pets">← All pets</Link>
          </p>
        </div>

        <div className="card-actions">
          <Link to={`/pets/${id}/edit`} className="btn btn-outline">
            Edit
          </Link>
          <Link to={`/pets/${id}/qr`} className="btn btn-outline">
            QR tag
          </Link>
          {!pet.isLost && (
            <Link to={`/lost?pet=${id}`} className="btn btn-danger">
              Report lost
            </Link>
          )}
          <button className="btn btn-outline danger-text" onClick={handleDelete} disabled={busy}>
            Delete
          </button>
        </div>
      </div>

      {actionError && <div className="alert alert-error">{actionError}</div>}

      {pet.isLost && (
        <LostPetBanner pet={pet} report={report} onResolve={report ? handleFound : undefined} resolving={busy} />
      )}

      <PetProfileCard pet={pet} />

      {/* owner view: public + private health details */}
      <PetHealthCard pet={pet} showPrivate />

      <div className="section-title">
        <h2>Scan history</h2>
        <span className="muted">{scans.length} scan(s)</span>
      </div>

      {scans.length === 0 ? (
        <div className="card empty">
          <p className="muted">No one has scanned this tag yet.</p>
        </div>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>When</th>
                <th>Device</th>
                <th>IP address</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan._id}>
                  <td>{formatDateTime(scan.scannedAt)}</td>
                  <td>{deviceLabel(scan.userAgent)}</td>
                  <td>{scan.ipAddress || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default PetDetails;