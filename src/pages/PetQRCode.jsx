import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPet } from "../Reducer/PetSlice";
import Loader from "../components/Loader";
import QRCodeCard from "../components/QRCodeCard";

const PetQRCode = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: pet, error } = useSelector((state) => state.pets);

  useEffect(() => {
    dispatch(fetchPet(id));
  }, [dispatch, id]);

  if (!pet || pet._id !== id) {
    return error ? <div className="alert alert-error">{error}</div> : <Loader text="Loading QR tag..." />;
  }

  return (
    <div className="narrow">
      <div className="page-header no-print">
        <div>
          <h1>QR tag</h1>
          <p className="muted">
            <Link to={`/pets/${id}`}>← Back to {pet.name}</Link>
          </p>
        </div>
      </div>

      <QRCodeCard pet={pet} />

      <div className="card tips no-print">
        <h3>How to use this tag</h3>
        <ul>
          <li>Print it and attach it to your pet's collar or harness.</li>
          <li>Anyone who scans it sees {pet.name}'s profile and can call you straight away.</li>
          <li>If {pet.name} goes missing, report it as lost so the community can see it.</li>
        </ul>
      </div>
    </div>
  );
};

export default PetQRCode;