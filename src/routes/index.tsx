import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/authContext";


const LandingPage = lazy(() => import("../pages/LandingPage"))
const LoginRegister = lazy(() => import("../pages/LoginRegister"))

export default function Router() {
    return (
        <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                
            <Route path="/" element={<LandingPage />} />   
            <Route path="/" element={<LoginRegister />} />
           
            </Routes>
        </Suspense>
        </BrowserRouter>
    )
}


