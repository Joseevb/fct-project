import { Link } from "react-router-dom";
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
} from "@/components/ui/navigation-menu";
import { useScreenSize } from "@/hooks/useScreenSize";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface HeaderProps {
	ref: React.RefObject<HTMLDivElement | null>;
}

export default function Header({ ref }: Readonly<HeaderProps>) {
	const { isAuthenticated, user, logout } = useAuth();
	// const location = useLocation();
	const screenSize = useScreenSize();

	return (
		<header
			className="w-dvw flex justify-between items-center p-3 shadow sticky top-0 bg-background z-50"
			id="mainHeader"
			ref={ref}
		>
			<Link to="/" className="text-2xl font-bold">
				LOGO
			</Link>

			{screenSize !== "xs" ? (
				<div className="flex gap-5 items-center">
					<NavigationMenu>
						<NavigationMenuList>
							{user && user.role === RoleEnum.ADMIN && (
								<NavigationMenuItem>
									<NavigationMenuLink asChild>
										<Link
											to="/admin"
											className={buttonVariants({
												variant: "link",
											})}
										>
											Admin
										</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							)}

							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link
										to="/#about"
										className={buttonVariants({
											variant: "link",
										})}
									>
										Acerca de
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>

							<NavigationMenuItem>
								{isAuthenticated ? (
									<Button
										variant={"outline"}
										onClick={() => logout()}
									>
										Cerrar sesión
									</Button>
								) : (
									<NavigationMenuLink asChild>
										<Link
											to="/login"
											className={buttonVariants({
												variant: "link",
											})}
											state={{ from: location.pathname }}
										>
											Iniciar sesión
										</Link>
									</NavigationMenuLink>
								)}
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
					<div className="flex items-center gap-3">
						<LanguageSelector />
						<ModeToggle />
					</div>
				</div>
			) : (
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="md:hidden"
						>
							<Menu className="h-4 w-4" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-[50dvw]">
						<div className="flex flex-col gap-4 mt-8">
							{user && user.role === RoleEnum.ADMIN && (
								<Link
									to="/admin"
									className={buttonVariants({
										variant: "ghost",
										className: "w-full justify-start",
									})}
								>
									Admin
								</Link>
							)}

							<Link
								to="/#about"
								className={buttonVariants({
									variant: "ghost",
									className: "w-full justify-start",
								})}
							>
								Acerca de
							</Link>

							{isAuthenticated ? (
								<Button
									variant={"outline"}
									onClick={() => logout()}
									className="w-full"
								>
									Cerrar sesión
								</Button>
							) : (
								<Link
									to="/login"
									className={buttonVariants({
										variant: "outline",
										className: "w-full justify-center",
									})}
									state={{ from: location.pathname }}
								>
									Iniciar sesión
								</Link>
							)}

							<div className="flex items-center gap-3 mt-4 justify-between">
								<LanguageSelector />
								<ModeToggle />
							</div>
						</div>
					</SheetContent>
				</Sheet>
			)}
		</header>
	);
}
