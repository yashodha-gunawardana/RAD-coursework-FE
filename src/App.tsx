// stores logged-in user data, authenticate status, users info with all pages
import { AuthProvider } from "./context/authContext";
import Router from "./routes"

// define the main App component
export default function App() {
  return (
    //This allows any child component to access user/login data using context
    <AuthProvider>
      
      {/* Router component handles page navigation */}
      <Router />

    </AuthProvider>
  )
  
}  
