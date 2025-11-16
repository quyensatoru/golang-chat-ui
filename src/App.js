import { Routes, Route, BrowserRouter, useNavigate, useNavigation, useLocation, Navigate, Outlet } from "react-router-dom"
import DashboardPage from "./pages/dashboard";
import ChatPage from "./pages/chat";
import EditorPage from "./pages/editor";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import AppProvider from "./components/layout/AppProvider";
import useFirebase from "./hook/firebase";
import LoginPage from "./pages/login";
import SettingsPage from "./pages/settings";
import ClustersPage from "./pages/clusters";
import SitesPage from "./pages/sites";

const ProtectedRoute = ({ user }) => {
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <AppProvider />
}

const PublicRoute = ({ user }) => {
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
};

export default function App() {
    const { auth } = useFirebase()
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="animate-pulse text-center">
                    <div className="h-8 w-8 rounded-full bg-muted mx-auto mb-2" />
                    <div>Loading...</div>
                </div>
            </div>
        )
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoute user={user} />}>
                    <Route path="/" element={<LoginPage />} />
                </Route>
                <Route element={<ProtectedRoute user={user} />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/clusters" element={<ClustersPage />} />
                    <Route path="/sites" element={<SitesPage />} />
                    <Route path="/editor" element={<EditorPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}