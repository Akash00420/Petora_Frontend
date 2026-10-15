import { createSlice } from "@reduxjs/toolkit";
import api from "../api/Api";
import { actionMatcher, makeThunk } from "../utils/helpers";

// :petId can be the Mongo _id or the PET-XXXXXX code
export const fetchScanHistory = makeThunk(
  "scans/history",
  async (petId) => (await api.get(`/scan/${petId}`)).data.scans
);

const scanSlice = createSlice({
  name: "scans",
  initialState: { scans: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScanHistory.fulfilled, (state, action) => {
        state.scans = action.payload;
      })
      .addMatcher(actionMatcher("scans/", "/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(actionMatcher("scans/", "/fulfilled"), (state) => {
        state.loading = false;
      })
      .addMatcher(actionMatcher("scans/", "/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default scanSlice.reducer;