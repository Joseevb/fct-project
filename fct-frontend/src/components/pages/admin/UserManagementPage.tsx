import AdminUserTable from "@/components/ui/admin/AdminUserTable";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { TypographyH3 } from "@/components/ui/typography";
import { useState } from "react";

const userViews = [{ value: "users", label: "Usuarios" }];

type UserView = (typeof userViews)[number]["value"];

export default function UserManagementPage() {
	const [selectedView, setSelectedView] = useState<UserView>("users");

	return (
		<section className="flex flex-col gap-4">
			<header>
				<TypographyH3 className="mb-10">Usuarios</TypographyH3>
				<NavigationMenu>
					<NavigationMenuList>
						{userViews.map((view) => (
							<NavigationMenuItem key={view.value}>
								<Button
									variant={
										selectedView === view.value
											? "default"
											: "ghost"
									}
									onClick={() => setSelectedView(view.value)}
								>
									{view.label}
								</Button>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</header>

			<AdminUserTable />
		</section>
	);
}
