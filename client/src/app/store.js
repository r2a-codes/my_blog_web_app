import { configureStore } from "@reduxjs/toolkit";
import darkModeSlice from "./darkModeSlice";
import authSlice from "./authSlice";
import blogSlice from "./blogSlice";

const store = configureStore({
  reducer: {
    darkModeSlice,
    authSlice,
    blogSlice,
  },
});

export default store;
