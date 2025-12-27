import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashBoardLayout from "../layouts/DashBoardLayout";
import Dashboard from "../pages/dashboard/Dashboard";


const LandingPage = lazy(() => import("../pages/LandingPage"))
const LoginRegister = lazy(() => import("../pages/LoginRegister"))

export default function Router() {
    return (
        <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>

            {/* public routes */}
            <Route path="/" element={<LandingPage />} />   
            <Route path="/auth" element={<LoginRegister />} />

            {/* dahboard routes*/}
            <Route element={<DashBoardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
           
            </Routes>
        </Suspense>
        </BrowserRouter>
    )
}


