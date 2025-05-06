import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UserCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
	logout: () => void;
}

export default function UserMenu({ logout }: Readonly<UserMenuProps>) {
	const navigate = useNavigate();

	const menuItemStyle = "cursor-pointer";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<UserCircleIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onClick={() => navigate("/profile")}
					className={cn(menuItemStyle)}
				>
					Perfil
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => navigate("/user/appointments")}
					className={cn(menuItemStyle)}
				>
					Mis citas
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => navigate("/cart")}
					className={cn(menuItemStyle)}
				>
					Mi Carrito
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => logout()}
					className={cn(menuItemStyle)}
				>
					Cerrar sesión
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
