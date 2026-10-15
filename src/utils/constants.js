export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// Base URL for uploaded files (pet photos, QR images) served by the backend
export const FILE_URL = API_URL.replace(/\/api\/?$/, "");

export const TOKEN_KEY = "petora_token";
export const USER_KEY = "petora_user";

export const SPECIES_OPTIONS = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Other"];

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unknown", label: "Unknown" },
];