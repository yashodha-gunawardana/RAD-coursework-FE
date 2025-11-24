import { Children, createContext } from "react";

// AuthContext will store auth data (user, setUser, loading)
const AuthContext = createContext<any>(null)

// AuthProvider wraps the whole app and provides auth data
export const AuthProvider = ({ Children }: any) => {

}