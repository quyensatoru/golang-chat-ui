import { Routes, Route, BrowserRouter, useNavigate, useNavigation, useLocation, Navigate, Outlet } from "react-router-dom"
import DashboardPage from "./pages/dashboard";
import ChatPage from "./pages/chat";
import EditorPage from "./pages/editor";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import AppProvider from "./components/layout/AppProvider";
import useFirebase from "./hook/firebase";
import { api } from "./lib/api";
import LoginPage from "./pages/login";
import SettingsPage from "./pages/settings";
import ServersPage from "./pages/servers";
import AppsPage from "./pages/apps";
import AppCreatePage from "./pages/apps/create";

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
        if (!user) return;

        const path = window.location.pathname;
        if (path === "/") return;


        function urlBase64ToUint8Array(base64) {
            const padding = "=".repeat((4 - (base64.length % 4)) % 4);
            const base64Safe = (base64 + padding)
                .replace(/\-/g, "+")
                .replace(/_/g, "/");
            const raw = atob(base64Safe);
            return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
        }
        (async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const publicVapidKey = "BBp2a1gwtWptMs5i99yKwrZRJlhoR8MIUtTkddwVV1vR7TvppSoV9dAU5kmILKKlXrgea7He1DNK4gIxpudrQDA";
                const register = await navigator.serviceWorker.register("/sw.js");

                await navigator.serviceWorker.ready;

                const subscription = await register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
                });

                await api.post("/notify/subscribe", subscription);
            } catch (e) {
                console.log("Error during service worker registration or push subscription:", e);
            }
        })()
    }, [user])

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
                    <Route path="/servers" element={<ServersPage />} />
                    <Route path="/apps" element={<AppsPage />} />
                    <Route path="/apps/create" element={<AppCreatePage />} />
                    <Route path="/editor" element={<EditorPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}