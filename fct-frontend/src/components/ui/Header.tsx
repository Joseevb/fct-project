import { RoleEnum } from "@/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import UserMenu from "@/components/ui/UserMenu";
import { heroItems } from "@/data/heroData";
import { useAuth } from "@/hooks/useAuth";
import { useScreenSize } from "@/hooks/useScreenSize";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";

interface HeaderProps {
	ref: React.RefObject<HTMLDivElement | null>;
}

interface NavItemProps {
	to: string;
	label: string;
	className?: string;
	state?: { from: string };
}

interface NavigationItem {
	to: string;
	label: string;
	state?: { from: string };
	isUserMenu?: boolean;
}

function NavItem({ to, label, className, state }: NavItemProps) {
	return (
		<NavigationMenuItem>
			<NavigationMenuLink asChild>
				<Link
					to={to}
					className={cn(
						buttonVariants({
							variant: "link",
						}),
						"text-foreground",
						className,
					)}
					state={state}
				>
					{label}
				</Link>
			</NavigationMenuLink>
		</NavigationMenuItem>
	);
}

function MobileNavItem({ to, label, className, state }: NavItemProps) {
	return (
		<Link
			to={to}
			className={cn(
				buttonVariants({
					variant: "ghost",
					className: "w-full justify-start",
				}),
				className,
			)}
			state={state}
		>
			{label}
		</Link>
	);
}

export default function Header({ ref }: Readonly<HeaderProps>) {
	const { isAuthenticated, user, logout } = useAuth();
	const screenSize = useScreenSize();

	function getNavigationItems(): NavigationItem[] {
		const items: NavigationItem[] = [];

		// Admin link
		if (user?.role === RoleEnum.ADMIN) {
			items.push({
				to: "/admin",
				label: "Admin",
			});
		}

		// Hero items
		items.push(
			...heroItems.map((item) => ({
				to: item.buttonUrl || "#",
				label: item.buttonLabel,
			})),
		);

		// About link
		items.push({
			to: "/#about",
			label: "Acerca de",
		});

		// Login/User menu
		if (isAuthenticated) {
			items.push({
				to: "#",
				label: "user-menu",
				isUserMenu: true,
			});
		} else {
			items.push({
				to: "/login",
				label: "Iniciar sesión",
				state: { from: location.pathname },
			});
		}

		return items;
	}

	function renderNavItems() {
		const items = getNavigationItems();

		return items.map((item, idx) => {
			if (item.isUserMenu) {
				return (
					<NavigationMenuItem key={idx}>
						<UserMenu logout={logout} />
					</NavigationMenuItem>
				);
			}
			return (
				<NavItem
					key={idx}
					to={item.to}
					label={item.label}
					state={item.state}
					className="text-xl font-bold py-6"
				/>
			);
		});
	}

	function renderMobileNavItems() {
		const items = getNavigationItems();

		return items.map((item, idx) => {
			if (item.isUserMenu) {
				return null;
			}
			return (
				<MobileNavItem
					key={idx}
					to={item.to}
					label={item.label}
					state={item.state}
				/>
			);
		});
	}

	return (
		<header
			className="w-dvw flex justify-between items-center shadow-xl p-3 fixed top-0 bg-background/85 dark:bg-backgound/50 backdrop-blur-md z-50 md:px-30"
			id="mainHeader"
			ref={ref}
		>
			<Link
				to={{ pathname: "/", hash: "hero" }}
				className="flex items-center h-15"
			>
				<img
					src={Logo}
					alt="Webpage logo"
					className="h-full w-auto object-contain"
				/>
			</Link>

			{screenSize !== "xs" ? (
				<div className="flex gap-5 items-center">
					<NavigationMenu>
						<NavigationMenuList className="flex gap-2">
							{renderNavItems()}
						</NavigationMenuList>
					</NavigationMenu>
					<div className="flex items-center gap-3">
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
					<SheetContent
						side="right"
						className="w-[300px] sm:w-[400px] p-6 flex flex-col"
					>
						<SheetHeader>
							<SheetTitle>
								<img src={Logo} alt="Logo" />
							</SheetTitle>
							<SheetDescription></SheetDescription>
						</SheetHeader>
						<div className="flex-1 flex flex-col justify-start pt-12">
							<div className="flex flex-col gap-2">
								{renderMobileNavItems()}
							</div>
						</div>

						<div className="flex items-center justify-between pt-4 border-t gap-4">
							<div className="flex justify-between w-full">
								<div className="flex items-center gap-3">
									<span className="text-sm text-muted-foreground">
										Tema
									</span>
								</div>
								<ModeToggle />
							</div>
							{isAuthenticated && <UserMenu logout={logout} />}
						</div>
					</SheetContent>
				</Sheet>
			)}
		</header>
	);
}
