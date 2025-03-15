import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Home from "../pages/Home";
import AdminDashboard from "../pages/Admin";
import Verify from "../pages/verify";
import Dwonlode from "../pages/VIwe_Dwonlods";
import AllDwonlode from "../pages/Dwonlodes";
const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/download' element={<AllDwonlode />} />
            <Route path='/download/v' element={<Dwonlode />} />
        </Routes>
    );
};

export default AppRouter;
