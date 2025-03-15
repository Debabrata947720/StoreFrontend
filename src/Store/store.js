import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import pdfReducer from "./slices/pdfSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    pdfs: pdfReducer,
  },
});

export default store;
