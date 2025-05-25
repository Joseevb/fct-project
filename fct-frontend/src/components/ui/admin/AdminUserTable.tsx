import { ErrorMessage, RoleEnum, User, UsersApi } from "@/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { tryCatch } from "@/lib/tryCatch";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError, AxiosResponse } from "axios";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AddUserSchema, addUserSchema } from "@/schemas/admin/addUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm, UseFormReturn } from "react-hook-form";
import {
	DynamicFormField,
	FieldConfig,
} from "@/components/ui/DynamicFormField";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Loader2, CheckCircle } from "lucide-react";
import { z } from "zod";
import { applyValidationErrors } from "@/lib/errorHandlers";
import { ResponseError } from "@/types/errors";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const columns: ColumnDef<Exclude<User, "password">>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "username",
		header: "Nombre de usuario",
	},
	{
		accessorKey: "firstName",
		header: "Nombre",
	},
	{
		accessorKey: "lastName",
		header: "Apellido",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		header: "Rol",
	},
	{
		accessorKey: "createdAt",
		header: "Fecha de creación",
	},
	{
		accessorKey: "updatedAt",
		header: "Fecha de actualización",
	},
] as const;

const fieldConfigs: Record<string, FieldConfig> = {
	username: {
		label: "Nombre de usuario",
		placeholder: "Nombre de usuario",
		type: "text",
	},
	password: {
		label: "Contraseña",
		placeholder: "Contraseña",
		type: "password",
	},
	firstName: {
		label: "Nombre",
		placeholder: "Nombre",
		type: "text",
	},
	lastName: {
		label: "Apellido",
		placeholder: "Apellido",
		type: "text",
	},
	email: {
		label: "Email",
		placeholder: "Email",
		type: "email",
	},
	role: {
		label: "Rol",
		placeholder: "Rol",
		type: "select",
		options: [
			{ value: RoleEnum.ADMIN, label: "Administrador" },
			{ value: RoleEnum.USER, label: "Usuario" },
		],
	},
} as const;

export default function AdminUserTable() {
	const [users, setUsers] = useState<User[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isAddUser, setIsAddUser] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [searchParams] = useSearchParams();

	const userId = searchParams.get("id");

	const form = useForm<AddUserSchema>({
		defaultValues: {
			username: "",
			email: "",
			password: "",
			firstName: "",
			lastName: "",
		},
		resolver: zodResolver(addUserSchema),
	});

	const fetchData = useCallback(async () => {
		const api = new UsersApi();
		const { data, error } = await tryCatch<
			AxiosResponse<User[]>,
			AxiosError<ErrorMessage>
		>(api.getAllUsers());

		if (error) {
			setError(
				error.response?.data.message || "Error al obtener usuarios",
			);
			return;
		}
		if (userId) {
			const user = data.data.find((user) => user.id === Number(userId));
			if (user) {
				setUsers([user]);
				return;
			}
		}

		setUsers(data.data);
	}, [userId]);

	async function onSubmit(data: z.infer<typeof addUserSchema>) {
		setIsLoading(true);

		const api = new UsersApi();

		const { data: res, error: addErr } = await tryCatch<
			AxiosResponse<User>,
			AxiosError<ResponseError>
		>(api.addUser(data));

		if (addErr) {
			const errRes = addErr.response?.data;

			if (errRes) {
				if ("messages" in errRes) {
					const validationErrors = Object.entries(
						errRes.messages,
					).map(([field, message]) => ({
						field,
						message,
					}));

					applyValidationErrors(validationErrors, form.setError);
				} else {
					toast.error(errRes.message || "Error inesperado");
				}
			}

			setIsLoading(false);
			return;
		}

		toast.success("Usuario agregado exitosamente", {
			richColors: true,
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">
						{JSON.stringify(res.data, null, 2)}
					</code>
				</pre>
			),
		});

		await fetchData();

		setError("");
		setIsLoading(false);
		setIsAddUser(false);
	}

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (error)
		return (
			<div className="container mx-auto py-10">
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);

	return (
		<div className="container mx-auto py-10">
			<section className="space-y-6">
				<DataTable columns={columns} data={users} />
				<Button variant={"default"} onClick={() => setIsAddUser(true)}>
					Agregar usuario
				</Button>
			</section>
			{isAddUser && (
				<AddUserForm
					form={form}
					isLoading={isLoading}
					setIsAddUser={setIsAddUser}
					onSubmit={onSubmit}
				/>
			)}
		</div>
	);
}

interface AddUserFormProps {
	form: UseFormReturn<AddUserSchema>;
	isLoading: boolean;
	onSubmit: (data: z.infer<typeof addUserSchema>) => void;
	setIsAddUser: Dispatch<SetStateAction<boolean>>;
}

function AddUserForm({
	form,
	isLoading,
	setIsAddUser,
	onSubmit,
}: AddUserFormProps) {
	return (
		<Card className="mt-6">
			<CardHeader className="flex items-center justify-between">
				<CardTitle>Agregar usuario</CardTitle>
				<Button variant={"ghost"} onClick={() => setIsAddUser(false)}>
					Cancelar
				</Button>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="space-y-6"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						{Object.keys(fieldConfigs).map((fieldName) => (
							<DynamicFormField<AddUserSchema>
								key={fieldName}
								name={fieldName as FieldPath<AddUserSchema>}
								fieldConfigs={fieldConfigs}
								control={form.control}
							/>
						))}
						<Button type="submit" variant={"default"}>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<CheckCircle className="mr-2 h-4 w-4" />
							)}
							{isLoading ? "Agregando..." : "Agregar"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
