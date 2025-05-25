import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ModeToggle() {
	const { setTheme } = useTheme();

	const menuItemStyle = "cursor-pointer";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Cambiar tema</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					className={cn(menuItemStyle)}
					onClick={() => setTheme("light")}
				>
					Claro
				</DropdownMenuItem>
				<DropdownMenuItem
					className={cn(menuItemStyle)}
					onClick={() => setTheme("dark")}
				>
					Oscuro
				</DropdownMenuItem>
				<DropdownMenuItem
					className={cn(menuItemStyle)}
					onClick={() => setTheme("system")}
				>
					Sistema
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
