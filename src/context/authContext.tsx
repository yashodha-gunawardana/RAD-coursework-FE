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
            // if token exists, verify it by calling backend
            getMyDetails().then((res) => {
                // save user details returned from backend
                setUser(res.data)
            })
            .catch((err) => {
                // if token expired or invalid, logout user
                setUser(null)
                console.error(err)
            })
            .finally(() => {
                // stop loading after check finishes
                setLoading(false)
            })
        } else {
            // no token means user not logged in
            setUser(null)
            setLoading(false)
        }
    }, [])
}