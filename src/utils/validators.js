export const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v || "");
export const isPhone = (v) => !v || /^[0-9+\-\s]{7,15}$/.test(v);

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!isEmail(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  return errors;
};

export const validateRegister = ({ name, email, phone, password, confirmPassword }) => {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required";
  if (!isEmail(email)) errors.email = "Enter a valid email address";
  if (!isPhone(phone)) errors.phone = "Enter a valid phone number";
  if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
  return errors;
};

export const validatePet = ({ name, species, age, contactPhone }) => {
  const errors = {};
  if (!name.trim()) errors.name = "Pet name is required";
  if (!species) errors.species = "Select a species";
  if (age !== "" && (Number.isNaN(Number(age)) || Number(age) < 0)) errors.age = "Age must be 0 or more";
  if (!isPhone(contactPhone)) errors.contactPhone = "Enter a valid phone number";
  return errors;
};