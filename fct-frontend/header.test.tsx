import { ForwardedRef, forwardRef } from "react"; // Import Fragment
import { Link } from "react-router-dom"; // Use React Router Link
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { RoleEnum } from "@/api"; // Make sure this path is correct
import LanguageSelector from "@/components/ui/LanguageSelector"; // Assuming this component exists
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetClose, // Import SheetClose for automatic closing
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	// SheetDescription, // Optional
	// SheetFooter, // Optional
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator"; // For visual separation in sheet
import { Menu } from "lucide-react"; // Icon for mobile trigger
import { cn } from "@/lib/utils"; // Utility for conditional classes

// --- Define reusable navigation/action items to avoid duplication ---

interface NavItemProps {
	to: string;
	label: string;
	isSheet?: boolean; // Flag for styling differences in sheet
	className?: string;
}

function NavLinkItem({ to, label, isSheet, className }: NavItemProps) {
	if (isSheet) {
		return (
			<SheetClose asChild>
				{/* asChild allows SheetClose to inherit Button/Link behavior */}
				<Link
					to={to.startsWith("/#") ? to : "/"}
					className={cn(className)}
				>
					{label}
				</Link>
			</SheetClose>
		);
	}

	// Desktop uses ShadCN NavigationMenuLink style
	return (
		<NavigationMenuItem>
			<Link
				to={to.startsWith("/#") ? to : "/"}
				className={cn(buttonVariants({ variant: "link" }))}
			>
				<NavigationMenuLink>{label}</NavigationMenuLink>
			</Link>
		</NavigationMenuItem>
	);
}

// --- Main Header Component ---

// Need forwardRef to correctly pass the ref from parent to the DOM header element
const Header = forwardRef((ref: ForwardedRef<HTMLDivElement>) => {
	const { isAuthenticated, user, logout } = useAuth();
	// const location = useLocation();

	// Define Navigation/Auth Items Data
	const navItems = [
		{
			to: "/#about",
			label: "Acerca de",
			adminOnly: false,
			requiresAuth: false,
		},
		// Add other main navigation links here
		{ to: "/admin", label: "Admin", adminOnly: true, requiresAuth: true },
	];

	const renderAuthAction = (isSheet = false) => {
		if (isAuthenticated) {
			return (
				<Button
					variant={"outline"}
					onClick={() => {
						logout();
						// Close sheet manually if needed after action? Typically handled by SheetClose if wrapped
					}}
				>
					Cerrar sesión
				</Button>
			);
		} else {
			const loginLabel = "Iniciar sesión";
			return (
				<SheetClose asChild>
					<NavLinkItem
						to={"/login"}
						className="block py-2 hover:underline"
						label={loginLabel}
						isSheet={isSheet}
					/>
				</SheetClose>
			);
		}
	};

	// Filter nav items based on auth/role
	const filteredNavItems = navItems.filter(
		(item) =>
			(!item.adminOnly ||
				(isAuthenticated && user?.role === RoleEnum.ADMIN)) &&
			(!item.requiresAuth || isAuthenticated),
	);

	return (
		<header
			// Use semantic header tag
			className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" // Common sticky header styles
			id="mainHeader"
			ref={ref} // assign the forwarded ref
		>
			<div className="mx-5 flex h-14 items-center justify-between">
				{" "}
				{/* Use container for max-width + padding */}
				<Link to="/" className="mr-6 flex items-center space-x-2">
					{/* <Icons.logo className="h-6 w-6" /> Optional Logo Icon */}
					<span className="font-bold sm:inline-block">LOGO</span>
				</Link>
				{/* --- Desktop Navigation (Hidden on Small Screens) --- */}
				<div className="hidden flex-1 md:flex items-center justify-end space-x-6">
					{" "}
					{/* Adjust spacing */}
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							{filteredNavItems.map((item) => (
								<NavLinkItem
									key={item.to}
									to={item.to}
									label={item.label}
								/>
							))}
							{/* Render desktop auth action */}
							{renderAuthAction(false)}
						</NavigationMenuList>
					</NavigationMenu>
					<div className="flex items-center space-x-2">
						<LanguageSelector />
						<ModeToggle />
					</div>
				</div>
				{/* --- Mobile Navigation Trigger (Visible ONLY on Small Screens) --- */}
				<div className="flex md:hidden">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon">
								<Menu className="h-6 w-6" />
								<span className="sr-only">
									Toggle Menu
								</span>{" "}
								{/* Accessibility */}
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[50dvw]">
							<SheetHeader>
								<SheetTitle>
									<Link to="/" className="font-bold">
										LOGO
									</Link>
								</SheetTitle>
							</SheetHeader>
							<div className="grid gap-4 py-4 align-center">
								{filteredNavItems.map((item) => (
									<NavLinkItem
										key={item.to}
										to={item.to}
										label={item.label}
									/>
								))}
								<Separator className="my-2" />
								<div className="mt-auto">
									{renderAuthAction(true)}
								</div>
								<Separator className="my-2" />
								<div className="flex flex-col space-y-3">
									<div className="text-sm font-medium">
										Configuración
									</div>
									<LanguageSelector />
									<ModeToggle />
								</div>
							</div>
							{/* Optional Footer <SheetFooter>...</SheetFooter> */}
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
});

export default Header; // Export the component wrapped in forwardRef
