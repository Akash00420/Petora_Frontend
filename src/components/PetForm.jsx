import { useState } from "react";
import { GENDER_OPTIONS, SPECIES_OPTIONS } from "../utils/constants";
import { fileUrl } from "../utils/helpers";
import { validatePet } from "../utils/validators";

const emptyValues = {
  name: "",
  species: "Dog",
  breed: "",
  age: "",
  gender: "unknown",
  color: "",
  contactPhone: "",
  description: "",
};

const buildInitial = (pet) =>
  pet
    ? {
        name: pet.name || "",
        species: pet.species || "Dog",
        breed: pet.breed || "",
        age: pet.age ?? "",
        gender: pet.gender || "unknown",
        color: pet.color || "",
        contactPhone: pet.contactPhone || "",
        description: pet.description || "",
      }
    : emptyValues;

// Shared by AddPet and EditPet. Calls onSubmit(formData) with multipart data.
const PetForm = ({ initial, onSubmit, submitting, submitLabel = "Save pet" }) => {
  const [values, setValues] = useState(buildInitial(initial));
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(fileUrl(initial?.photo));
  const [errors, setErrors] = useState({});

  const speciesOptions = SPECIES_OPTIONS.includes(values.species)
    ? SPECIES_OPTIONS
    : [...SPECIES_OPTIONS, values.species];

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validatePet(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value).trim()));
    if (photo) formData.append("photo", photo);
    onSubmit(formData);
  };

  return (
    <form className="form card" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Pet name *</label>
          <input id="name" name="name" value={values.name} onChange={handleChange} placeholder="Bruno" />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="species">Species *</label>
          <select id="species" name="species" value={values.species} onChange={handleChange}>
            {speciesOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.species && <span className="field-error">{errors.species}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="breed">Breed</label>
          <input id="breed" name="breed" value={values.breed} onChange={handleChange} placeholder="Labrador" />
        </div>

        <div className="form-group">
          <label htmlFor="color">Color</label>
          <input id="color" name="color" value={values.color} onChange={handleChange} placeholder="Golden" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age">Age (years)</label>
          <input id="age" name="age" type="number" min="0" step="any" value={values.age} onChange={handleChange} />
          {errors.age && <span className="field-error">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={values.gender} onChange={handleChange}>
            {GENDER_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="contactPhone">Contact phone (shown to whoever scans the tag)</label>
        <input
          id="contactPhone"
          name="contactPhone"
          value={values.contactPhone}
          onChange={handleChange}
          placeholder="9876543210"
        />
        {errors.contactPhone && <span className="field-error">{errors.contactPhone}</span>}
      </div>

      <div className="form-group">
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

      <div className="form-group">
        <label htmlFor="photo">Photo</label>
        <input id="photo" type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} />
        {preview && <img className="photo-preview" src={preview} alt="Pet preview" />}
      </div>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default PetForm;