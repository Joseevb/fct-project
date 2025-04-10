import { Link } from "react-router";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className="w-dvw flex justify-between p-3">
            <Link to="/" className="text-2xl font-bold">
                LOGO
            </Link>

            <section className="flex gap-2">
                <ModeToggle />
                {isAuthenticated ? (
                    <Button variant={"outline"} onClick={logout}>
                        Logout
                    </Button>
                ) : (
                    <Link
                        to="/login"
                        className={buttonVariants({ variant: "link" })}
                    >
                        Login
                    </Link>
                )}
            </section>
        </header>
    );
}
