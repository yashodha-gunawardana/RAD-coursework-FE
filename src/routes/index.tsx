import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashBoardLayout from "../layouts/DashBoardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import EventPage from "../pages/dashboard/EventPage";
import EventForm from "../components/EventForm";
import VendorPage from "../pages/dashboard/VendorPage";
import VendorForm from "../components/VendorForm";


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
            <Route path="/dashboard" element={<DashBoardLayout />}>
                <Route index element={<Dashboard />} />          
                <Route path="events" element={<EventPage />} />
                <Route path="events/create" element={<EventForm />} /> 
                <Route path="events/edit" element={<EventForm />} /> 
                <Route path="vendors" element={<VendorPage />} />
                <Route path="vendors/create" element={<VendorForm />} />
                <Route path="vendors/edit" element={<VendorForm />} />    
                
            </Route>
           
            </Routes>
        </Suspense>
        </BrowserRouter>
    )
}


