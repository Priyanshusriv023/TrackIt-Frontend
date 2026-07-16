import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useAuth } from "./context/authContext";
import ApplicationDetail from "./pages/ApplicationDetails.jsx";
import Analytics from "./pages/Analytics.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx"



const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Loading...</p>
        </div>
    );
    return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Loading...</p>
        </div>
    );
    return user ? <Navigate to="/dashboard" /> : children;
};


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/applications/:appId" element={<ProtectedRoute><ApplicationDetail /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}



export default App;