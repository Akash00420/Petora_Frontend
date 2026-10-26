import { Plus, Trash2, Globe, Lock } from "lucide-react";

const VACCINES = ["Rabies", "DHPP", "DHLPP", "Bordetella", "Leptospirosis", "FVRCP", "FeLV", "Other"];

const emptyVaccine = { name: "", dateGiven: "", nextDue: "", vet: "" };
const emptyParasite = { type: "deworming", product: "", dateGiven: "", nextDue: "" };

export const emptyExtras = {
  dateOfBirth: "",
  distinguishingMarks: "",
  temperament: { notes: "", approachWithCaution: false },
  medical: { alerts: "", showOnTag: false },
  weightKg: "",
  neutered: "unknown",
  vaccinations: [],
  parasiteTreatments: [],
  vet: { clinicName: "", phone: "" },
  microchipNumber: "",
  licenseNumber: "",
  insuranceProvider: "",
  insurancePolicy: "",
};

const day = (v) => (v ? String(v).slice(0, 10) : "");

// turn a saved pet into form values (dates -> yyyy-mm-dd)
export const extrasFromPet = (pet) => {
  if (!pet) return { ...emptyExtras };
  return {
    ...emptyExtras,
    dateOfBirth: day(pet.dateOfBirth),
    distinguishingMarks: pet.distinguishingMarks || "",
    temperament: { ...emptyExtras.temperament, ...(pet.temperament || {}) },
    medical: { ...emptyExtras.medical, ...(pet.medical || {}) },
    weightKg: pet.weightKg ?? "",
    neutered: pet.neutered || "unknown",
    vaccinations: (pet.vaccinations || []).map((v) => ({
      name: v.name || "",
      vet: v.vet || "",
      dateGiven: day(v.dateGiven),
      nextDue: day(v.nextDue),
    })),
    parasiteTreatments: (pet.parasiteTreatments || []).map((p) => ({
      type: p.type || "deworming",
      product: p.product || "",
      dateGiven: day(p.dateGiven),
      nextDue: day(p.nextDue),
    })),
    vet: { ...emptyExtras.vet, ...(pet.vet || {}) },
    microchipNumber: pet.microchipNumber || "",
    licenseNumber: pet.licenseNumber || "",
    insuranceProvider: pet.insuranceProvider || "",
    insurancePolicy: pet.insurancePolicy || "",
  };
};

const Section = ({ title, hint, visibility, children }) => (
  <fieldset className="pe-section">
    <div className="pe-head">
      <div>
        <h3>{title}</h3>
        {hint && <p>{hint}</p>}
      </div>
      {visibility === "public" ? (
        <span className="vis-badge public">
          <Globe size={11} /> Shown to finders
        </span>
      ) : (
        <span className="vis-badge private">
          <Lock size={11} /> Private
        </span>
      )}
    </div>
    {children}
  </fieldset>
);

const PetExtrasForm = ({ values, onChange }) => {
  const set = (patch) => onChange({ ...values, ...patch });
  const setNested = (key, patch) => set({ [key]: { ...values[key], ...patch } });

  const updateRow = (key, index, patch) =>
    set({ [key]: values[key].map((row, i) => (i === index ? { ...row, ...patch } : row)) });
  const addRow = (key, row) => set({ [key]: [...values[key], { ...row }] });
  const removeRow = (key, index) => set({ [key]: values[key].filter((_, i) => i !== index) });

  return (
    <div className="pe-wrap">
      {/* ---------- Identification & behaviour ---------- */}
      <Section
        title="Identification & behaviour"
        hint="Helps a finder confirm it's the right pet and approach safely."
        visibility="public"
      >
        <div className="pf-group">
          <label htmlFor="marks">Distinguishing marks</label>
          <input
            id="marks"
            value={values.distinguishingMarks}
            onChange={(e) => set({ distinguishingMarks: e.target.value })}
            maxLength="300"
            placeholder="White patch on chest, scar on left ear, red collar..."
          />
        </div>

        <div className="pf-group">
          <label htmlFor="temperament">Temperament</label>
          <input
            id="temperament"
            value={values.temperament.notes}
            onChange={(e) => setNested("temperament", { notes: e.target.value })}
            maxLength="300"
            placeholder="Friendly, shy, scared of loud noises..."
          />
          <label className="check-row">
            <input
              type="checkbox"
              checked={values.temperament.approachWithCaution}
              onChange={(e) => setNested("temperament", { approachWithCaution: e.target.checked })}
            />
            Approach with caution (may bite or panic)
          </label>
        </div>
      </Section>

      {/* ---------- Medical alerts ---------- */}
      <Section
        title="Medical alerts"
        hint="Allergies, medication or conditions like diabetes. Seconds matter here."
        visibility={values.medical.showOnTag ? "public" : "private"}
      >
        <div className="pf-group">
          <label htmlFor="alerts">Medical alerts</label>
          <textarea
            id="alerts"
            rows="2"
            maxLength="500"
            value={values.medical.alerts}
            onChange={(e) => setNested("medical", { alerts: e.target.value })}
            placeholder="Allergic to chicken. Needs insulin twice daily."
          />
          <label className="check-row">
            <input
              type="checkbox"
              checked={values.medical.showOnTag}
              onChange={(e) => setNested("medical", { showOnTag: e.target.checked })}
            />
            Show on tag (visible to anyone who scans the QR code)
          </label>
        </div>
      </Section>

      {/* ---------- Basics ---------- */}
      <Section title="Basics" hint="Age is calculated automatically from the date of birth." visibility="public">
        <div className="pf-row">
          <div className="pf-group">
            <label htmlFor="weightKg">Weight (kg)</label>
            <input
              id="weightKg"
              type="number"
              min="0"
              max="200"
              step="0.1"
              value={values.weightKg}
              onChange={(e) => set({ weightKg: e.target.value })}
              placeholder="e.g. 12.5"
            />
          </div>
          <div className="pf-group">
            <label htmlFor="neutered">Neutered / spayed</label>
            <select id="neutered" value={values.neutered} onChange={(e) => set({ neutered: e.target.value })}>
              <option value="unknown">Unknown</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </Section>

      {/* ---------- Vaccinations ---------- */}
      <Section
        title="Vaccinations"
        hint="Finders and vets can see what's up to date. Add the next due date to get reminders later."
        visibility="public"
      >
        <datalist id="vaccine-names">
          {VACCINES.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>

        {values.vaccinations.map((v, i) => (
          <div className="pe-entry" key={i}>
            <div className="pe-entry-grid">
              <div className="pf-group">
                <label>Vaccine</label>
                <input
                  list="vaccine-names"
                  value={v.name}
                  onChange={(e) => updateRow("vaccinations", i, { name: e.target.value })}
                  placeholder="Rabies"
                />
              </div>
              <div className="pf-group">
                <label>Date given</label>
                <input
                  type="date"
                  value={v.dateGiven}
                  onChange={(e) => updateRow("vaccinations", i, { dateGiven: e.target.value })}
                />
              </div>
              <div className="pf-group">
                <label>Next due</label>
                <input
                  type="date"
                  value={v.nextDue}
                  onChange={(e) => updateRow("vaccinations", i, { nextDue: e.target.value })}
                />
              </div>
              <div className="pf-group">
                <label>Vet</label>
                <input
                  value={v.vet}
                  onChange={(e) => updateRow("vaccinations", i, { vet: e.target.value })}
                  placeholder="Dr. Sen"
                />
              </div>
            </div>
            <button type="button" className="pe-remove" onClick={() => removeRow("vaccinations", i)} aria-label="Remove vaccination">
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <button type="button" className="pe-add" onClick={() => addRow("vaccinations", emptyVaccine)}>
          <Plus size={14} /> Add vaccination
        </button>
      </Section>

      {/* ---------- Parasite treatment ---------- */}
      <Section title="Parasite treatment" hint="Deworming and flea / tick treatments." visibility="private">
        {values.parasiteTreatments.map((p, i) => (
          <div className="pe-entry" key={i}>
            <div className="pe-entry-grid">
              <div className="pf-group">
                <label>Type</label>
                <select value={p.type} onChange={(e) => updateRow("parasiteTreatments", i, { type: e.target.value })}>
                  <option value="deworming">Deworming</option>
                  <option value="flea_tick">Flea / tick</option>
                </select>
              </div>
              <div className="pf-group">
                <label>Product</label>
                <input
                  value={p.product}
                  onChange={(e) => updateRow("parasiteTreatments", i, { product: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div className="pf-group">
                <label>Date given</label>
                <input
                  type="date"
                  value={p.dateGiven}
                  onChange={(e) => updateRow("parasiteTreatments", i, { dateGiven: e.target.value })}
                />
              </div>
              <div className="pf-group">
                <label>Next due</label>
                <input
                  type="date"
                  value={p.nextDue}
                  onChange={(e) => updateRow("parasiteTreatments", i, { nextDue: e.target.value })}
                />
              </div>
            </div>
            <button type="button" className="pe-remove" onClick={() => removeRow("parasiteTreatments", i)} aria-label="Remove treatment">
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <button type="button" className="pe-add" onClick={() => addRow("parasiteTreatments", emptyParasite)}>
          <Plus size={14} /> Add treatment
        </button>
      </Section>

      {/* ---------- Vet ---------- */}
      <Section title="Vet details" visibility="private">
        <div className="pf-row">
          <div className="pf-group">
            <label htmlFor="clinic">Clinic name</label>
            <input
              id="clinic"
              value={values.vet.clinicName}
              onChange={(e) => setNested("vet", { clinicName: e.target.value })}
              placeholder="Happy Paws Clinic"
            />
          </div>
          <div className="pf-group">
            <label htmlFor="vetPhone">Clinic phone</label>
            <input
              id="vetPhone"
              value={values.vet.phone}
              onChange={(e) => setNested("vet", { phone: e.target.value })}
              placeholder="+91 33 1234 5678"
            />
          </div>
        </div>
      </Section>

      {/* ---------- IDs ---------- */}
      <Section title="Microchip, licence & insurance" visibility="private">
        <div className="pf-row">
          <div className="pf-group">
            <label htmlFor="microchip">Microchip number</label>
            <input
              id="microchip"
              value={values.microchipNumber}
              onChange={(e) => set({ microchipNumber: e.target.value })}
              placeholder="15-digit number"
            />
          </div>
          <div className="pf-group">
            <label htmlFor="license">Licence / rabies tag no.</label>
            <input
              id="license"
              value={values.licenseNumber}
              onChange={(e) => set({ licenseNumber: e.target.value })}
            />
          </div>
        </div>
        <div className="pf-row">
          <div className="pf-group">
            <label htmlFor="insProvider">Insurance provider</label>
            <input
              id="insProvider"
              value={values.insuranceProvider}
              onChange={(e) => set({ insuranceProvider: e.target.value })}
            />
          </div>
          <div className="pf-group">
            <label htmlFor="insPolicy">Policy number</label>
            <input
              id="insPolicy"
              value={values.insurancePolicy}
              onChange={(e) => set({ insurancePolicy: e.target.value })}
            />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default PetExtrasForm;