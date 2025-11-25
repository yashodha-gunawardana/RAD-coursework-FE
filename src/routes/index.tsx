import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/authContext";


const LoginRegister = lazy(() => import("../pages/LoginRegister"))

export default function Router() {
    return (
        <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
            <Route path="/" element={<LoginRegister />} />
           {/*} <Route path="/home" element={<Home />} /> */}
            </Routes>
        </Suspense>
        </BrowserRouter>
    )
}


