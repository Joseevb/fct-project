import { Link } from "react-router";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className="w-dvw flex justify-between p-3 shadow">
            <Link to="/" className="text-2xl font-bold">
                LOGO
            </Link>

            <section className="flex gap-2">
                <Link
                    to="/#about"
                    className={buttonVariants({ variant: "link" })}
                >
                    Acerca de
                </Link>
                {isAuthenticated ? (
                    <Button variant={"outline"} onClick={logout}>
                        Cerrar sesión
                    </Button>
                ) : (
                    <Link
                        to="/login"
                        className={buttonVariants({ variant: "link" })}
                    >
                        Iniciar sesión
                    </Link>
                )}
                <ModeToggle />
            </section>
        </header>
    );
}
