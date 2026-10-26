import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createPet } from "../Reducer/PetSlice";
import { thunkError } from "../utils/helpers";
import PetForm from "../components/PetForm";

const AddPet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError("");
    try {
      const pet = await dispatch(createPet(formData)).unwrap();
      navigate(`/pets/${pet._id}/qr`); // show the new QR tag straight away
    } catch (err) {
      setError(thunkError(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="narrow add-pet-page">
      <div className="page-header">
        <div>
          <nav className="breadcrumb breadcrumb-caps">
            Pets <span>/</span> <strong>Add new pet</strong>
          </nav>
          <h1>Add a pet</h1>
          <p className="page-sub">We'll generate a Pet ID and QR tag as soon as you save.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <PetForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Save pet & generate QR" />
    </div>
  );
};

export default AddPet;