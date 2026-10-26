import { ShieldAlert, HeartPulse, Syringe, Stethoscope, Fingerprint, Bug } from "lucide-react";
import { formatDate } from "../utils/helpers";

// "2 years 3 months" from a date of birth
const ageFromDob = (dob) => {
  if (!dob) return "";
  const b = new Date(dob);
  if (Number.isNaN(b.getTime())) return "";
  const now = new Date();
  let months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
  if (now.getDate() < b.getDate()) months -= 1;
  if (months < 0) return "";
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} month${m === 1 ? "" : "s"}`;
  return `${y} year${y === 1 ? "" : "s"}${m ? ` ${m} month${m === 1 ? "" : "s"}` : ""}`;
};

// overdue / due soon / ok
const dueStatus = (nextDue) => {
  if (!nextDue) return null;
  const days = Math.ceil((new Date(nextDue).getTime() - Date.now()) / 86400000);
  if (days < 0) return { label: "Overdue", tone: "red" };
  if (days <= 30) return { label: "Due soon", tone: "amber" };
  return { label: "Up to date", tone: "green" };
};

const Row = ({ label, children }) =>
  children ? (
    <div className="hc-row">
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  ) : null;

/**
 * pet          - pet object (public view on the scan page, full pet for the owner)
 * showPrivate  - true on the owner's pages: also shows vet, parasite and ID details
 */
const PetHealthCard = ({ pet, showPrivate = false }) => {
  if (!pet) return null;

  const age = ageFromDob(pet.dateOfBirth);
  const neutered = { yes: "Yes", no: "No" }[pet.neutered];
  const vaccinations = pet.vaccinations || [];
  const parasites = pet.parasiteTreatments || [];
  const hasBasics = age || pet.weightKg || neutered;
  const hasIds = pet.microchipNumber || pet.licenseNumber || pet.insuranceProvider || pet.insurancePolicy;

  return (
    <div className="health-card">
      {pet.temperament?.approachWithCaution && (
        <div className="hc-banner caution">
          <ShieldAlert size={16} />
          <div>
            <strong>Approach with caution</strong>
            <span>{pet.temperament.notes || "This pet may bite or panic when scared."}</span>
          </div>
        </div>
      )}

      {pet.medical?.alerts && (pet.medical.showOnTag || showPrivate) && (
        <div className="hc-banner medical">
          <HeartPulse size={16} />
          <div>
            <strong>Medical alert{showPrivate && !pet.medical.showOnTag ? " (hidden from finders)" : ""}</strong>
            <span>{pet.medical.alerts}</span>
          </div>
        </div>
      )}

      {(pet.distinguishingMarks || (pet.temperament?.notes && !pet.temperament.approachWithCaution) || hasBasics) && (
        <section className="hc-section">
          <h4>About</h4>
          <Row label="Distinguishing marks">{pet.distinguishingMarks}</Row>
          <Row label="Temperament">{!pet.temperament?.approachWithCaution && pet.temperament?.notes}</Row>
          <Row label="Age">{age}</Row>
          <Row label="Weight">{pet.weightKg ? `${pet.weightKg} kg` : ""}</Row>
          <Row label="Neutered / spayed">{neutered}</Row>
        </section>
      )}

      {vaccinations.length > 0 && (
        <section className="hc-section">
          <h4>
            <Syringe size={14} /> Vaccinations
          </h4>
          {vaccinations.map((v, i) => {
            const status = dueStatus(v.nextDue);
            return (
              <div className="hc-vax" key={v._id || i}>
                <div>
                  <strong>{v.name}</strong>
                  <small>
                    {v.dateGiven ? `Given ${formatDate(v.dateGiven)}` : "Date not added"}
                    {v.vet ? ` · ${v.vet}` : ""}
                    {v.nextDue ? ` · Next due ${formatDate(v.nextDue)}` : ""}
                  </small>
                </div>
                {status && <span className={`due-badge ${status.tone}`}>{status.label}</span>}
              </div>
            );
          })}
        </section>
      )}

      {showPrivate && parasites.length > 0 && (
        <section className="hc-section">
          <h4>
            <Bug size={14} /> Parasite treatment
          </h4>
          {parasites.map((p, i) => {
            const status = dueStatus(p.nextDue);
            return (
              <div className="hc-vax" key={p._id || i}>
                <div>
                  <strong>{p.type === "flea_tick" ? "Flea / tick" : "Deworming"}</strong>
                  <small>
                    {p.dateGiven ? `Given ${formatDate(p.dateGiven)}` : "Date not added"}
                    {p.product ? ` · ${p.product}` : ""}
                    {p.nextDue ? ` · Next due ${formatDate(p.nextDue)}` : ""}
                  </small>
                </div>
                {status && <span className={`due-badge ${status.tone}`}>{status.label}</span>}
              </div>
            );
          })}
        </section>
      )}

      {showPrivate && (pet.vet?.clinicName || pet.vet?.phone) && (
        <section className="hc-section">
          <h4>
            <Stethoscope size={14} /> Vet
          </h4>
          <Row label="Clinic">{pet.vet.clinicName}</Row>
          <Row label="Phone">{pet.vet.phone}</Row>
        </section>
      )}

      {showPrivate && hasIds && (
        <section className="hc-section">
          <h4>
            <Fingerprint size={14} /> Microchip, licence & insurance
          </h4>
          <Row label="Microchip">{pet.microchipNumber}</Row>
          <Row label="Licence / rabies tag">{pet.licenseNumber}</Row>
          <Row label="Insurance">{pet.insuranceProvider}</Row>
          <Row label="Policy number">{pet.insurancePolicy}</Row>
        </section>
      )}
    </div>
  );
};

export default PetHealthCard;