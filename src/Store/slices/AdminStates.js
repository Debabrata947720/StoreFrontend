import { createSlice } from "@reduxjs/toolkit";


const AdminSlice = createSlice({
    name: "Admin",
    initialState: {
        AdminDashboard: null,
    },
    reducers: {
        AddData: (state, action) => {
            state.AdminDashboard =action.payload
        }
    },
});

export const { AddData } = AdminSlice.actions;
export default AdminSlice.reducer;
