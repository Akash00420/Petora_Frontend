import { formatDateTime } from "../utils/helpers";

// Red alert for a lost pet. `report` (optional) adds last-seen details,
// `onResolve` (optional) adds a "Mark as found" button, children render extra content.
const LostPetBanner = ({ pet, report, onResolve, resolving, children }) => (
  <div className="lost-banner">
    <div className="lost-banner-text">
      <strong>🚨 {pet.name} is reported lost</strong>
      {report?.lastSeenLocation && (
        <p>
          Last seen: {report.lastSeenLocation}
          {report.lastSeenAt ? ` · ${formatDateTime(report.lastSeenAt)}` : ""}
        </p>
      )}
      {report?.notes && <p>{report.notes}</p>}
      {children}
    </div>

    {onResolve && (
      <button className="btn btn-success btn-sm" onClick={onResolve} disabled={resolving}>
        {resolving ? "Updating..." : "Mark as found"}
      </button>
    )}
  </div>
);

export default LostPetBanner;