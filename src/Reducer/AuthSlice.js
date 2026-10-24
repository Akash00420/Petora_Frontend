import { createSlice } from "@reduxjs/toolkit";
import api from "../api/Api";
import { actionMatcher, clearAuth, loadAuth, makeThunk, saveAuth } from "../utils/helpers";

const stored = loadAuth();

export const registerUser = makeThunk("auth/register", async (data) => {
  const res = await api.post("/auth/register", data);
  saveAuth(res.data.token, res.data.user);
  return res.data;
});

export const loginUser = makeThunk("auth/login", async (data) => {
  const res = await api.post("/auth/login", data);
  saveAuth(res.data.token, res.data.user);
  return res.data;
});

export const fetchMe = makeThunk("auth/me", async () => {
  const res = await api.get("/auth/me");
  return res.data.user;
});

// Upload / replace the profile photo (multipart, field name "photo")
export const uploadProfilePhoto = makeThunk("auth/uploadPhoto", async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const res = await api.put("/auth/profile/photo", formData);
  return res.data.user;
});

// Update name / phone
export const updateProfile = makeThunk("auth/updateProfile", async (data) => {
  const res = await api.put("/auth/profile", data);
  return res.data.user;
});

// Change password while logged in
export const changePassword = makeThunk("auth/changePassword", async (data) => {
  const res = await api.put("/auth/change-password", data);
  return res.data.message;
});

// Step 1: email an OTP
export const forgotPassword = makeThunk("auth/forgot", async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data.message;
});

// Step 2: check the OTP, set the new password and log in
export const resetPassword = makeThunk("auth/reset", async ({ email, otp, password }) => {
  const res = await api.put("/auth/reset-password", { email, otp, password });
  saveAuth(res.data.token, res.data.user);
  return res.data;
});

export const logoutUser = makeThunk("auth/logout", async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // token may already be invalid - still clear the local session
  }
  clearAuth();
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: stored.user, token: stored.token, loading: false, error: null, message: null },
  reducers: {
    clearAuthStatus(state) {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    const setSession = (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    };

    // merge the fresh user into state and keep the saved session in sync
    const mergeUser = (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (state.token) saveAuth(state.token, state.user);
    };

    builder
      .addCase(registerUser.fulfilled, setSession)
      .addCase(loginUser.fulfilled, setSession)
      .addCase(resetPassword.fulfilled, setSession)
      .addCase(fetchMe.fulfilled, mergeUser)
      .addCase(uploadProfilePhoto.fulfilled, mergeUser)
      .addCase(updateProfile.fulfilled, mergeUser)
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
      })
      .addMatcher(actionMatcher("auth/", "/pending"), (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addMatcher(actionMatcher("auth/", "/fulfilled"), (state) => {
        state.loading = false;
      })
      .addMatcher(actionMatcher("auth/", "/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearAuthStatus } = authSlice.actions;
export default authSlice.reducer;