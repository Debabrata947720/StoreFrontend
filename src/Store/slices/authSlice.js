import { createSlice } from "@reduxjs/toolkit";

const getLocal = (key) => {
    return JSON.parse(localStorage.getItem(key));
};
const setValue = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLogin: getLocal("isLogin"),
        isAdmin: getLocal("isAdmin"),
    },
    reducers: {
        SetLoginStutas: (state, action) => {
            state.isLogin = action.payload;
            setValue("isLogin", action.payload);
        },
        SetAdmin: (state, action) => {
            state.isAdmin = action.payload;
            setValue("isAdmin", action.payload);
        },
    },
});

export const { SetLoginStutas, SetAdmin } = authSlice.actions;
export default authSlice.reducer;
