import { LanguageCode, LanguageDisplayNames } from "@/types/languages";
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LanguageSelector() {
	const { language, setLanguage } = useLanguage("es");

	const menuItemStyle = "cursor-pointer";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					{language.toUpperCase()}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{Object.entries(LanguageDisplayNames).map(([code, name]) => (
					<DropdownMenuItem
						key={code}
						onSelect={() => setLanguage(code as LanguageCode)}
						className={cn(menuItemStyle)}
					>
						{name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
