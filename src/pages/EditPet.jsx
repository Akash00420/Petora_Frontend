import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPet, updatePet } from "../Reducer/PetSlice";
import { thunkError } from "../utils/helpers";
import Loader from "../components/Loader";
import PetForm from "../components/PetForm";

const EditPet = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: pet, error } = useSelector((state) => state.pets);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchPet(id));
  }, [dispatch, id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setFormError("");
    try {
      await dispatch(updatePet({ id, formData })).unwrap();
      navigate(`/pets/${id}`);
    } catch (err) {
      setFormError(thunkError(err));
      setSubmitting(false);
    }
  };

  if (!pet || pet._id !== id) {
    return error ? <div className="alert alert-error">{error}</div> : <Loader text="Loading pet..." />;
  }

  return (
    <div className="narrow">
      <div className="page-header">
        <div>
          <h1>Edit {pet.name}</h1>
          <p className="muted">
            <Link to={`/pets/${id}`}>← Back to profile</Link>
          </p>
        </div>
      </div>

      {formError && <div className="alert alert-error">{formError}</div>}

      <PetForm key={pet._id} initial={pet} onSubmit={handleSubmit} submitting={submitting} submitLabel="Save changes" />
    </div>
  );
};

export default EditPet;