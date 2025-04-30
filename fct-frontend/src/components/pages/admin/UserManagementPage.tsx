import AdminUserTable from "@/components/ui/admin/AdminUserTable";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useState } from "react";

const userViews = [{ value: "users", label: "Usuarios" }];

type UserView = (typeof userViews)[number]["value"];

export default function UserManagementPage() {
	const [selectedView, setSelectedView] = useState<UserView>("users");

	return (
		<section className="flex flex-col gap-4">
			<header className="flex items-center gap-8 mb-5">
				<h2 className="text-2xl font-semibold tracking-tight">
					Usuarios
				</h2>
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
