import { createSlice } from "@reduxjs/toolkit";
import api from "../api/Api";
import { actionMatcher, makeThunk } from "../utils/helpers";

// Public community feed of active lost-pet reports
export const fetchLostFeed = makeThunk("lost/feed", async () => (await api.get("/lost")).data.reports);

// The logged-in user's own reports (active + resolved)
export const fetchMyLostReports = makeThunk("lost/mine", async () => (await api.get("/lost/my")).data.reports);

export const markPetLost = makeThunk(
  "lost/mark",
  async ({ petId, data }) => (await api.post(`/lost/${petId}`, data)).data.report
);

export const resolveLostReport = makeThunk(
  "lost/resolve",
  async (reportId) => (await api.put(`/lost/${reportId}/resolve`)).data.report
);

const lostSlice = createSlice({
  name: "lost",
  initialState: { feed: [], myReports: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLostFeed.fulfilled, (state, action) => {
        state.feed = action.payload;
      })
      .addCase(fetchMyLostReports.fulfilled, (state, action) => {
        state.myReports = action.payload;
      })
      .addMatcher(actionMatcher("lost/", "/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(actionMatcher("lost/", "/fulfilled"), (state) => {
        state.loading = false;
      })
      .addMatcher(actionMatcher("lost/", "/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default lostSlice.reducer;