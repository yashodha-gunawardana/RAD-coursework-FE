import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashBoardLayout from "../pages/DashBoardLayout";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";


const LandingPage = lazy(() => import("../pages/LandingPage"))
const LoginRegister = lazy(() => import("../pages/LoginRegister"))

export default function Router() {
    return (
        <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>

            <Route path="/" element={<LandingPage />} />   
            <Route path="/auth" element={<LoginRegister />} />

            <Route element={<DashBoardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
           
            </Routes>
        </Suspense>
        </BrowserRouter>
    )
}


