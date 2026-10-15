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

export const forgotPassword = makeThunk("auth/forgot", async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data.message;
});

export const resetPassword = makeThunk("auth/reset", async ({ token, password }) => {
  const res = await api.put(`/auth/reset-password/${token}`, { password });
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

    builder
      .addCase(registerUser.fulfilled, setSession)
      .addCase(loginUser.fulfilled, setSession)
      .addCase(resetPassword.fulfilled, setSession)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
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