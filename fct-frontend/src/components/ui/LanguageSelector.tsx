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

export default function LanguageSelector() {
	const { language, setLanguage } = useLanguage("es");

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
					>
						{name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
