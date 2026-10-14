import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets } from "../Reducer/PetSlice";
import { fetchLostFeed, fetchMyLostReports, markPetLost, resolveLostReport } from "../Reducer/LostSlice";
import { fileUrl, formatDateTime, speciesEmoji, thunkError } from "../utils/helpers";

const emptyForm = { petId: "", lastSeenLocation: "", lastSeenAt: "", notes: "", contactPhone: "" };

const LostPet = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { pets } = useSelector((state) => state.pets);
  const { feed, myReports } = useSelector((state) => state.lost);

  const [form, setForm] = useState({ ...emptyForm, petId: searchParams.get("pet") || "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAll = useCallback(() => {
    dispatch(fetchPets());
    dispatch(fetchMyLostReports());
    dispatch(fetchLostFeed());
  }, [dispatch]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const eligiblePets = pets.filter((p) => !p.isLost);
  const activeReports = myReports.filter((r) => r.status === "active");
  const pastReports = myReports.filter((r) => r.status === "resolved");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.petId) return setError("Choose which pet is missing");

    const data = {
      lastSeenLocation: form.lastSeenLocation.trim(),
      notes: form.notes.trim(),
      contactPhone: form.contactPhone.trim(),
    };
    if (form.lastSeenAt) data.lastSeenAt = new Date(form.lastSeenAt).toISOString();

    setSubmitting(true);
    try {
      await dispatch(markPetLost({ petId: form.petId, data })).unwrap();
      setSuccess("Lost report created. Your pet's tag now shows a lost alert.");
      setForm(emptyForm);
      loadAll();
    } catch (err) {
      setError(thunkError(err));
    }
    setSubmitting(false);
  };

  const handleResolve = async (reportId) => {
    setError("");
    setSuccess("");
    try {
      await dispatch(resolveLostReport(reportId)).unwrap();
      setSuccess("Great news! The report was marked as found.");
      loadAll();
    } catch (err) {
      setError(thunkError(err));
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Lost pets</h1>
          <p className="muted">Report a missing pet, or see who in the community is looking for theirs.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="card">
        <h2>Report a pet lost</h2>

        {eligiblePets.length === 0 ? (
          <p className="muted">
            {pets.length === 0 ? (
              <>
                You have no pets yet. <Link to="/pets/add">Add one</Link> first.
              </>
            ) : (
              "All your pets are already reported lost."
            )}
          </p>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="petId">Which pet? *</label>
              <select id="petId" name="petId" value={form.petId} onChange={handleChange}>
                <option value="">Select a pet...</option>
                {eligiblePets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} ({pet.petId})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lastSeenLocation">Last seen location</label>
                <input
                  id="lastSeenLocation"
                  name="lastSeenLocation"
                  value={form.lastSeenLocation}
                  onChange={handleChange}
                  placeholder="Salt Lake, Kolkata"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastSeenAt">Last seen at</label>
                <input
                  id="lastSeenAt"
                  name="lastSeenAt"
                  type="datetime-local"
                  value={form.lastSeenAt}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Contact phone for this report</label>
              <input id="contactPhone" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                maxLength="500"
                value={form.notes}
                onChange={handleChange}
                placeholder="Wearing a red collar, answers to his name..."
              />
            </div>

            <button className="btn btn-danger" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Report lost"}
            </button>
          </form>
        )}
      </section>

      <div className="section-title">
        <h2>My active reports</h2>
      </div>

      {activeReports.length === 0 ? (
        <p className="muted">You have no active lost reports.</p>
      ) : (
        <div className="report-list">
          {activeReports.map((report) => (
            <div className="card report-card" key={report._id}>
              <div>
                <h3>{report.pet?.name || "Unknown pet"}</h3>
                <p className="muted">
                  {report.lastSeenLocation || "Location not given"} · {formatDateTime(report.lastSeenAt)}
                </p>
                {report.notes && <p>{report.notes}</p>}
              </div>
              <button className="btn btn-success btn-sm" onClick={() => handleResolve(report._id)}>
                Mark as found
              </button>
            </div>
          ))}
        </div>
      )}

      {pastReports.length > 0 && (
        <p className="muted past-reports">
          {pastReports.length} earlier report(s) resolved: {pastReports.map((r) => r.pet?.name).filter(Boolean).join(", ")}
        </p>
      )}

      <div className="section-title">
        <h2>Community lost pets</h2>
        <span className="muted">{feed.length} active</span>
      </div>

      {feed.length === 0 ? (
        <p className="muted">No pets are reported lost right now.</p>
      ) : (
        <div className="pet-grid">
          {feed.map((report) =>
            report.pet ? (
              <article className="pet-card is-lost" key={report._id}>
                <div className="pet-card-photo">
                  {report.pet.photo ? (
                    <img src={fileUrl(report.pet.photo)} alt={report.pet.name} />
                  ) : (
                    <span className="pet-emoji">{speciesEmoji(report.pet.species)}</span>
                  )}
                  <span className="badge badge-danger">LOST</span>
                </div>
                <div className="pet-card-body">
                  <h3>{report.pet.name}</h3>
                  <p className="muted">
                    {report.pet.species}
                    {report.pet.breed ? ` · ${report.pet.breed}` : ""}
                  </p>
                  <p className="small">📍 {report.lastSeenLocation || "Location not given"}</p>
                  <p className="small muted">{formatDateTime(report.lastSeenAt)}</p>
                  <div className="card-actions">
                    <Link className="btn btn-primary btn-sm" to={`/scan/${report.pet.petId}`}>
                      See details
                    </Link>
                  </div>
                </div>
              </article>
            ) : null
          )}
        </div>
      )}
    </>
  );
};

export default LostPet;