import { createAsyncThunk } from "@reduxjs/toolkit";
import { FILE_URL, TOKEN_KEY, USER_KEY } from "./constants";

export const fileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${FILE_URL}${path}`;
};

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

// Errors thrown by `dispatch(thunk).unwrap()` are the rejectWithValue string
export const thunkError = (err) =>
  typeof err === "string" ? err : err?.message || "Something went wrong";

export const speciesEmoji = (species = "") => {
  const s = species.toLowerCase();
  if (s.includes("dog")) return "🐶";
  if (s.includes("cat")) return "🐱";
  if (s.includes("bird") || s.includes("parrot")) return "🐦";
  if (s.includes("rabbit")) return "🐰";
  if (s.includes("hamster")) return "🐹";
  return "🐾";
};

export const deviceLabel = (ua = "") => {
  if (/mobile|android|iphone/i.test(ua)) return "Mobile";
  return ua ? "Desktop" : "Unknown";
};

// Find the active lost report for a pet (report.pet is populated or an id)
export const findActiveReport = (reports = [], petMongoId) =>
  reports.find((r) => r.status === "active" && (r.pet?._id || r.pet) === petMongoId);

// ---- auth storage ----
export const loadAuth = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    return { token: token || null, user: token ? user : null };
  } catch {
    return { token: null, user: null };
  }
};

export const saveAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ---- redux helpers ----
// createAsyncThunk wrapper that turns any API error into a readable string
export const makeThunk = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  });

export const actionMatcher = (prefix, suffix) => (action) =>
  action.type.startsWith(prefix) && action.type.endsWith(suffix);