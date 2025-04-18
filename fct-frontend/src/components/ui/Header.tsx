import { Link, useLocation } from "react-router";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { RoleEnum } from "@/api";
import LanguageSelector from "@/components/ui/LanguageSelector";

interface HeaderProps {
	ref: React.RefObject<HTMLDivElement | null>;
}

export default function Header({ ref }: Readonly<HeaderProps>) {
	const { isAuthenticated, user, logout } = useAuth();
	const location = useLocation();

	return (
		<header
			className="w-dvw flex justify-between p-3 shadow"
			id="mainHeader"
			ref={ref}
		>
			<Link to="/" className="text-2xl font-bold">
				LOGO
			</Link>

			<section className="flex gap-2">
				{user && user.role === RoleEnum.ADMIN && (
					<Link
						to="/admin"
						className={buttonVariants({ variant: "link" })}
					>
						Admin
					</Link>
				)}

				<Link
					to="/#about"
					className={buttonVariants({ variant: "link" })}
				>
					Acerca de
				</Link>
				{isAuthenticated ? (
					<Button variant={"outline"} onClick={() => logout()}>
						Cerrar sesión
					</Button>
				) : (
					<Link
						to="/login"
						className={buttonVariants({ variant: "link" })}
						state={{ from: location.pathname }}
					>
						Iniciar sesión
					</Link>
				)}

				<div className="flex items-center gap-3">
					<LanguageSelector />
					<ModeToggle />
				</div>
			</section>
		</header>
	);
}
