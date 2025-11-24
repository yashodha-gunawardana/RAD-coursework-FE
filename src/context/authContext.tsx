import { createContext, useEffect, useState } from "react";

// AuthContext will store auth data (user, setUser, loading)
const AuthContext = createContext<any>(null)

// AuthProvider wraps the whole app and provides auth data
export const AuthProvider = ({ children }: any) => {
    // store logged-in user details(null means not logged in)
    const [user, setUser] = useState<any>(null)

    // true while checking login status
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        const token = localStorage.getItem("accessToken")
    })
}