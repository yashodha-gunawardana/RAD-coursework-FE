import { createContext, useEffect, useState } from "react";
import { getMyDetails } from "../services/auth";

// AuthContext will store auth data (user, setUser, loading)
const AuthContext = createContext<any>(null)

// AuthProvider wraps the whole app and provides auth data
export const AuthProvider = ({ children }: any) => {
    // store logged-in user details(null means not logged in)
    const [user, setUser] = useState<any>(null)

    // true while checking login status
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        // get token save after the login
        const token = localStorage.getItem("accessToken")

        if (token) {
            getMyDetails().then((res) => {
                
            })
        }
    })
}