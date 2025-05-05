import { RoleEnum } from "@/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserMenu from "@/components/ui/UserMenu";
import { heroItems } from "@/data/heroData";
import { useAuth } from "@/hooks/useAuth";
import { useScreenSize } from "@/hooks/useScreenSize";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
	ref: React.RefObject<HTMLDivElement | null>;
}

export default function Header({ ref }: Readonly<HeaderProps>) {
	const { isAuthenticated, user, logout } = useAuth();
	const screenSize = useScreenSize();

	const headerLinkStyle = "text-foreground";

	return (
		<header
			className="w-dvw flex justify-between items-center shadow-xl p-3 fixed top-0 bg-background z-50"
			id="mainHeader"
			ref={ref}
		>
			<Link
				to={{ pathname: "/", hash: "hero" }}
				className="text-2xl font-bold"
			>
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
											className={cn(
												buttonVariants({
													variant: "link",
												}),
												headerLinkStyle,
											)}
										>
											Admin
										</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							)}

							{heroItems.map((item, idx) => (
								<NavigationMenuItem key={idx}>
									<NavigationMenuLink asChild>
										<Link
											to={item.buttonUrl || "#"}
											className={cn(
												buttonVariants({
													variant: "link",
												}),
												headerLinkStyle,
											)}
										>
											{item.buttonLabel}
										</Link>
									</NavigationMenuLink>
								</NavigationMenuItem>
							))}

							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link
										to="/#about"
										className={cn(
											buttonVariants({
												variant: "link",
											}),
											headerLinkStyle,
										)}
									>
										Acerca de
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>

							<NavigationMenuItem>
								{isAuthenticated ? (
									<UserMenu logout={logout} />
								) : (
									<NavigationMenuLink asChild>
										<Link
											to="/login"
											className={cn(
												buttonVariants({
													variant: "link",
												}),
												headerLinkStyle,
											)}
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
						{/* <LanguageSelector />*/}
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
								<UserMenu logout={logout} />
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
								{/* <LanguageSelector />*/}
								<ModeToggle />
							</div>
						</div>
					</SheetContent>
				</Sheet>
			)}
		</header>
	);
}
