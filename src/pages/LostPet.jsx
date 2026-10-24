import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TriangleAlert, MapPin, Phone, CheckCircle2, ShieldCheck } from "lucide-react";
import { fetchPets } from "../Reducer/PetSlice";
import { fetchLostFeed, fetchMyLostReports, markPetLost, resolveLostReport } from "../Reducer/LostSlice";
import { fileUrl, formatDateTime, speciesEmoji, thunkError } from "../utils/helpers";

// current local time in the format datetime-local expects
const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const makeEmptyForm = () => ({
  petId: "",
  lastSeenLocation: "",
  lastSeenAt: nowLocal(),
  notes: "",
  contactPhone: "",
});

const FILTERS = [
  { key: "near", label: "Within 5 miles" },
  { key: "all", label: "All areas" },
  { key: "recent", label: "Recent" },
];

const LostPet = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { pets } = useSelector((state) => state.pets);
  const { feed, myReports } = useSelector((state) => state.lost);

  const [form, setForm] = useState({ ...makeEmptyForm(), petId: searchParams.get("pet") || "" });
  const [filter, setFilter] = useState("all");
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
  const pastNames = pastReports.map((r) => r.pet?.name).filter(Boolean).join(", ");

  // "recent" = reported in the last 7 days. The other chips need location data.
  const visibleFeed = feed.filter((r) => {
    if (!r.pet) return false;
    if (filter === "recent") {
      return Date.now() - new Date(r.lastSeenAt || r.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
    }
    return true;
  });

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
      setForm(makeEmptyForm());
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
    <div className="lost-page">
      <div className="page-header">
        <div>
          <h1>Lost pets</h1>
          <p className="page-sub">
            Report a missing pet, or see who in the community is looking for theirs.
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* ---------- Report form ---------- */}
      <section className="card lost-form-card">
        <div className="lost-card-head">
          <span className="lost-icon">
            <TriangleAlert size={16} />
          </span>
          <div>
            <h2>Report a pet lost</h2>
            <p>Broadcasts immediately to registered Petora tag-finders nearby.</p>
          </div>
        </div>

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
              <label htmlFor="petId">
                Which pet? <span className="req">*</span>
              </label>
              <select id="petId" name="petId" value={form.petId} onChange={handleChange}>
                <option value="">Select a pet...</option>
                {eligiblePets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} ({pet.petId})
                  </option>
                ))}
              </select>
            </div>

            <div className="lost-form-row">
              <div className="form-group">
                <label htmlFor="lastSeenLocation">Last seen location</label>
                <div className="input-icon">
                  <MapPin size={14} />
                  <input
                    id="lastSeenLocation"
                    name="lastSeenLocation"
                    value={form.lastSeenLocation}
                    onChange={handleChange}
                    placeholder="Salt Lake, Kolkata"
                  />
                </div>
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
              <div className="label-row">
                <label htmlFor="contactPhone">Contact phone for this report</label>
                <small>Visible to verified finders</small>
              </div>
              <div className="input-icon">
                <Phone size={14} />
                <input
                  id="contactPhone"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes / Distinctive features</label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                maxLength="500"
                value={form.notes}
                onChange={handleChange}
                placeholder="Wearing a red collar, answers to his name, very friendly, microchipped..."
              />
            </div>

            <button className="btn btn-danger btn-block" type="submit" disabled={submitting}>
              <TriangleAlert size={15} />
              {submitting ? "Submitting..." : "Report lost"}
            </button>
          </form>
        )}
      </section>

      {/* ---------- My active reports ---------- */}
      <div className="section-title">
        <h2>My active reports</h2>
        {activeReports.length === 0 ? (
          <span className="pill pill-green">
            <span className="pill-dot" /> All pets safe
          </span>
        ) : (
          <span className="pill pill-red">{activeReports.length} active</span>
        )}
      </div>

      {activeReports.length === 0 ? (
        <div className="card status-card">
          <span className="status-icon green">
            <CheckCircle2 size={16} />
          </span>
          <div className="status-text">
            <strong>You have no active lost reports.</strong>
            <small>None of your registered tags are currently in lost mode.</small>
          </div>
          {pastReports.length > 0 && (
            <span className="pill pill-gray">
              <span className="pill-dot gray" /> {pastReports.length} earlier report(s) resolved:{" "}
              <b>{pastNames}</b>
            </span>
          )}
        </div>
      ) : (
        <>
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

          {pastReports.length > 0 && (
            <p className="muted past-reports">
              {pastReports.length} earlier report(s) resolved: {pastNames}
            </p>
          )}
        </>
      )}

      {/* ---------- Community feed ---------- */}
      <div className="section-title community-title">
        <div>
          <h2>Community lost pets</h2>
          <p className="page-sub">Reports shared by pet parents in your vicinity.</p>
        </div>
        <div className="filter-chips">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`chip ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visibleFeed.length === 0 ? (
        <div className="card empty-card">
          <span className="status-icon green big">
            <ShieldCheck size={20} />
          </span>
          <h3>No pets are reported lost right now</h3>
          <p>
            The Petora neighborhood radar is actively listening for NFC &amp; QR collar scans. If
            someone reports a missing pet nearby, details will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="pet-grid">
          {visibleFeed.map((report) => (
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
                <p className="small">
                  <MapPin size={12} /> {report.lastSeenLocation || "Location not given"}
                </p>
                <p className="small muted">{formatDateTime(report.lastSeenAt)}</p>
                <div className="card-actions">
                  <Link className="btn btn-primary btn-sm" to={`/scan/${report.pet.petId}`}>
                    See details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostPet;