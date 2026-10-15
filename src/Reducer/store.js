import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import petReducer from "./PetSlice";
import lostReducer from "./LostSlice";
import scanReducer from "./ScanSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petReducer,
    lost: lostReducer,
    scans: scanReducer,
  },
  // FormData is passed as a thunk argument for pet create/update
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: { ignoredActionPaths: ["meta.arg"] } }),
});

export default store;