import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("../pages/Home"));
const Signup = lazy(() => import("../pages/Signup"));
const Login = lazy(() => import("../pages/Login"));
const AdminDashboard = lazy(() => import("../pages/Admin"));
const Verify = lazy(() => import("../pages/verify"));
const Dwonlode = lazy(() => import("../pages/VIwe_Dwonlods"));
const AllDwonlode = lazy(() => import("../pages/Dwonlodes"));
const AdminOTP = lazy(() => import("../pages/AdminOtp"));

import LoadingFallback from  "../components/Loading"

const AppRouter = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/login' element={<Login />} />
                <Route path='/admin' element={<AdminDashboard />} />
                <Route path='/verify' element={<Verify />} />
                <Route path='/download' element={<AllDwonlode />} />
                <Route path='/download/v' element={<Dwonlode />} />
                <Route path='/admin/verify' element={<AdminOTP />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
