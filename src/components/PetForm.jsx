import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Camera, QrCode, ArrowRight } from "lucide-react";
import { fileUrl } from "../utils/helpers";
import PetExtrasForm, { extrasFromPet } from "./PetExtrasForm";

const emptyValues = {
  name: "",
  species: "Dog",
  breed: "",
  color: "",
  gender: "unknown",
  contactPhone: "",
  description: "",
};

const BASE_FIELDS = ["name", "species", "breed", "color", "gender", "contactPhone", "description"];

// `pet` is optional, pass it when you reuse this form for editing
const PetForm = ({ pet, onSubmit, submitting, submitLabel = "Save" }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ ...emptyValues, ...(pet || {}) });
  const [extras, setExtras] = useState(() => extrasFromPet(pet));
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(pet?.photo ? fileUrl(pet.photo) : "");
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().slice(0, 10);

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const pickFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return setErrors({ ...errors, photo: "Please choose an image file" });
    }
    if (file.size > 10 * 1024 * 1024) {
      return setErrors({ ...errors, photo: "Image must be 10MB or smaller" });
    }
    setErrors({ ...errors, photo: "" });
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name.trim()) return setErrors({ name: "Pet name is required" });
    if (extras.dateOfBirth && extras.dateOfBirth > today) {
      return setErrors({ dob: "Date of birth cannot be in the future" });
    }
    setErrors({});

    const data = new FormData();
    BASE_FIELDS.forEach((key) => {
      const val = values[key];
      if (val !== "" && val !== null && val !== undefined) data.append(key, String(val).trim());
    });
    data.append("extras", JSON.stringify(extras)); // backend: parseExtras(req.body)
    if (photo) data.append("photo", photo);

    onSubmit(data);
  };

  return (
    <form className="card pet-form-card" onSubmit={handleSubmit}>
      <div className="pf-row">
        <div className="pf-group">
          <label htmlFor="name">
            Pet name <span className="req">*</span>
          </label>
          <input id="name" name="name" value={values.name} onChange={handleChange} placeholder="Bruno" />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="pf-group">
          <label htmlFor="species">
            Species <span className="req">*</span>
          </label>
          <select id="species" name="species" value={values.species} onChange={handleChange}>
            <option>Dog</option>
            <option>Cat</option>
            <option>Bird</option>
            <option>Rabbit</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="pf-row">
        <div className="pf-group">
          <label htmlFor="breed">Breed</label>
          <input id="breed" name="breed" value={values.breed} onChange={handleChange} placeholder="Labrador" />
        </div>

        <div className="pf-group">
          <label htmlFor="color">Color</label>
          <input id="color" name="color" value={values.color} onChange={handleChange} placeholder="Golden" />
        </div>
      </div>

      <div className="pf-row">
        <div className="pf-group">
          <label htmlFor="dateOfBirth">Date of birth</label>
          <input
            id="dateOfBirth"
            type="date"
            max={today}
            value={extras.dateOfBirth}
            onChange={(e) => setExtras({ ...extras, dateOfBirth: e.target.value })}
          />
          {errors.dob && <span className="field-error">{errors.dob}</span>}
        </div>

        <div className="pf-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={values.gender} onChange={handleChange}>
            <option value="unknown">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="pf-group">
        <div className="pf-label-row">
          <label htmlFor="contactPhone">Contact phone (shown to whoever scans the tag)</label>
          <small>Used for live SOS alerts</small>
        </div>
        <div className="pf-input-icon">
          <Phone size={14} />
          <input
            id="contactPhone"
            name="contactPhone"
            value={values.contactPhone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div className="pf-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          maxLength="500"
          value={values.description}
          onChange={handleChange}
          placeholder="Friendly, loves walks, responds to his name..."
        />
      </div>

      {/* health, safety & records */}
      <PetExtrasForm values={extras} onChange={setExtras} />

      <div className="pf-group">
        <label>Photo</label>
        <label
          className={`dropzone ${dragging ? "dragging" : ""} ${preview ? "has-preview" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => pickFile(e.target.files?.[0])} />
          {preview ? (
            <img src={preview} alt="Pet preview" className="dropzone-preview" />
          ) : (
            <span className="dropzone-icon">
              <Camera size={16} />
            </span>
          )}
          <span className="dropzone-text">
            <b>{preview ? "Change photo" : "Upload a photo"}</b> or drag and drop
          </span>
          <small>PNG, JPG, WEBP up to 10MB</small>
        </label>
        {errors.photo && <span className="field-error">{errors.photo}</span>}
      </div>

      {!pet && (
        <div className="qr-note">
          <span className="qr-note-icon">
            <QrCode size={14} />
          </span>
          <p>
            <b>Smart QR Tag auto-generation:</b> Saving {values.name.trim() || "your pet"} will
            immediately allocate a unique alphanumeric Pet ID (e.g. <code>PET-UNE730</code>) and
            generate a printable instant-alert QR collar code.
          </p>
        </div>
      )}

      <div className="pf-footer">
        <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
          {!submitting && <ArrowRight size={15} />}
        </button>
      </div>
    </form>
  );
};

export default PetForm;