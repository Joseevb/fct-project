import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "@/components/ui/Header";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/components/pages/HomePage";
import { ThemeProvider } from "@/components/theme-provider";
import AuthPage from "@/components/pages/AuthPage";
import { useAuth } from "@/hooks/useAuth";

export default function App() {
    const { user } = useAuth();

    console.log("user:", user);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="theme">
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<AuthPage />} />
                </Routes>
                <Toaster />
            </BrowserRouter>
        </ThemeProvider>
    );
}

/**
 * 
                    {["/", "/home", "/index"].map((path, idx) => (
                        <Route key={idx} path={path} element={<HomePage />} />
                    ))}
 */
