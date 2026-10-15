import { createSlice } from "@reduxjs/toolkit";
import api from "../api/Api";
import { actionMatcher, makeThunk } from "../utils/helpers";

export const fetchPets = makeThunk("pets/fetchAll", async () => (await api.get("/pets")).data.pets);

export const fetchPet = makeThunk("pets/fetchOne", async (id) => (await api.get(`/pets/${id}`)).data.pet);

export const createPet = makeThunk("pets/create", async (formData) => (await api.post("/pets", formData)).data.pet);

export const updatePet = makeThunk(
  "pets/update",
  async ({ id, formData }) => (await api.put(`/pets/${id}`, formData)).data.pet
);

export const deletePet = makeThunk("pets/delete", async (id) => {
  await api.delete(`/pets/${id}`);
  return id;
});

// Public lookup used by the QR scan page (also logs a scan on the backend)
export const fetchPublicPet = makeThunk(
  "pets/fetchPublic",
  async (petId) => (await api.get(`/pets/public/${petId}`)).data.pet
);

const petSlice = createSlice({
  name: "pets",
  initialState: { pets: [], current: null, publicPet: null, loading: false, error: null },
  reducers: {
    clearPublicPet(state) {
      state.publicPet = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.pets = action.payload;
      })
      .addCase(fetchPet.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.pets.unshift(action.payload);
        state.current = action.payload;
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        state.current = action.payload;
        state.pets = state.pets.map((p) => (p._id === action.payload._id ? action.payload : p));
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.pets = state.pets.filter((p) => p._id !== action.payload);
        state.current = null;
      })
      .addCase(fetchPublicPet.fulfilled, (state, action) => {
        state.publicPet = action.payload;
      })
      .addMatcher(actionMatcher("pets/", "/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(actionMatcher("pets/", "/fulfilled"), (state) => {
        state.loading = false;
      })
      .addMatcher(actionMatcher("pets/", "/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearPublicPet } = petSlice.actions;
export default petSlice.reducer;