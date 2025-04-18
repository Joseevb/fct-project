import { Link, useLocation } from "react-router";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { RoleEnum } from "@/api";
import LanguageSelector from "@/components/ui/LanguageSelector";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./navigation-menu";

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
			<div className="flex gap-5">
				<NavigationMenu>
					<NavigationMenuList>
						{user && user.role === RoleEnum.ADMIN && (
							<NavigationMenuItem>
								<Link
									to="/admin"
									className={buttonVariants({
										variant: "link",
									})}
								>
									<NavigationMenuLink>
										Admin
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						)}

						<NavigationMenuItem>
							<Link
								to="/#about"
								className={buttonVariants({ variant: "link" })}
							>
								<NavigationMenuLink>
									Acerca de
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						{isAuthenticated ? (
							<NavigationMenuItem>
								<Button
									variant={"outline"}
									onClick={() => logout()}
								>
									Cerrar sesión
								</Button>
							</NavigationMenuItem>
						) : (
							<NavigationMenuItem>
								<Link
									to="/login"
									className={buttonVariants({
										variant: "link",
									})}
									state={{ from: location.pathname }}
								>
									<NavigationMenuLink>
										Iniciar sesión
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						)}
					</NavigationMenuList>
				</NavigationMenu>
				<div className="flex items-center gap-3">
					<LanguageSelector />
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
