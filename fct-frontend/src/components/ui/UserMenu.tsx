import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
	UserCircleIcon,
	User,
	Calendar,
	ShoppingCart,
	LogOut,
	GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
	logout: () => void;
}

export default function UserMenu({ logout }: Readonly<UserMenuProps>) {
	const navigate = useNavigate();

	const menuItemStyle = "cursor-pointer flex items-center gap-2";

	const items = [
		{
			icon: User,
			label: "Perfil",
			onClick: () => navigate("/profile"),
		},
		{
			icon: Calendar,
			label: "Mis citas",
			onClick: () => navigate("/user/appointments"),
		},
		{
			icon: GraduationCap,
			label: "Mis cursos",
			onClick: () => navigate("/user/courses"),
		},
		{
			icon: ShoppingCart,
			label: "Carrito",
			onClick: () => navigate("/cart"),
		},
		{
			icon: LogOut,
			label: "Cerrar sesión",
			onClick: () => logout(),
		},
	] as const;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<UserCircleIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{items.map((item) => (
					<DropdownMenuItem
						key={item.label}
						{...(item.onClick ? { onClick: item.onClick } : {})}
						className={cn(menuItemStyle)}
					>
						<item.icon className="h-4 w-4" />
						{item.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
