import { fileUrl } from "../utils/helpers";

const QRCodeCard = ({ pet }) => {
  const qrSrc = fileUrl(pet.qrCodeUrl);
  const scanLink = `${window.location.origin}/scan/${pet.petId}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrSrc);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${pet.petId}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(qrSrc, "_blank");
    }
  };

  return (
    <section className="card qr-card">
      <h2>{pet.name}'s QR tag</h2>
      <p className="pet-code">{pet.petId}</p>

      {qrSrc ? (
        <img className="qr-image" src={qrSrc} alt={`QR code for ${pet.name}`} />
      ) : (
        <p className="muted">No QR code available for this pet.</p>
      )}

      <p className="muted qr-link">{scanLink}</p>

      <div className="card-actions no-print">
        <button className="btn btn-primary" onClick={handleDownload} disabled={!qrSrc}>
          Download PNG
        </button>
        <button className="btn btn-outline" onClick={() => window.print()}>
          Print tag
        </button>
      </div>
    </section>
  );
};

export default QRCodeCard;