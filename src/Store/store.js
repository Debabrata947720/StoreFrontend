import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import pdfReducer from "./slices/pdfSlice";
import adminReduser from "./slices/AdminStates";
const store = configureStore({
    reducer: {
        auth: authReducer,
        pdfs: pdfReducer,
        Admin: adminReduser,
    },
});

export default store;
