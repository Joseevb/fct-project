import { useState, useEffect, useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AxiosError, AxiosResponse } from "axios";
import { Plus, Pencil, Trash2, CheckCircle, X, Loader2 } from "lucide-react";
import {
	Address,
	AddressesApi,
	AddAddressRequest,
	UpdateAddressRequest,
	AddressTypeEnum,
} from "@/api";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AddressFields } from "@/components/ui/AddressFields";
import { tryCatch } from "@/lib/tryCatch";
import { applyValidationErrors } from "@/lib/errorHandlers";
import { ResponseError } from "@/types/errors";
import {
	updateAddressSchema,
	UpdateAddressFormData,
} from "@/schemas/updateAddressSchema";

interface UserAddressesProps {
	userId: number;
}

export function UserAddresses({ userId }: UserAddressesProps) {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
	const [deleteConfirmAddress, setDeleteConfirmAddress] =
		useState<Address | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const addressesApi = useMemo(() => new AddressesApi(), []);

	const form = useForm<UpdateAddressFormData>({
		defaultValues: {
			street: "",
			city: "",
			state: "",
			zipCode: "",
			country: "",
			addressType: AddressTypeEnum.PRIMARY,
		},
		resolver: zodResolver(updateAddressSchema),
	});

	// Fetch user addresses
	const fetchAddresses = useCallback(async () => {
		if (!userId) return;

		setLoading(true);
		setError("");

		const { data, error: fetchError } = await tryCatch<
			AxiosResponse<Address[]>,
			AxiosError<ResponseError>
		>(addressesApi.getAllAddresses(userId));

		if (fetchError) {
			console.error("Error fetching addresses:", fetchError);
			setError("No se pudieron cargar las direcciones");
			setLoading(false);
			return;
		}

		setAddresses(data?.data || []);
		setLoading(false);
	}, [addressesApi, userId]);

	// Load addresses on component mount
	useEffect(() => {
		fetchAddresses();
	}, [fetchAddresses, userId]);

	// Handle adding a new address
	const handleAddAddress = async (data: UpdateAddressFormData) => {
		setLoading(true);
		setError("");

		const addressRequest: AddAddressRequest = {
			...data,
			userId,
		};

		const { error: addError } = await tryCatch<
			AxiosResponse<Address>,
			AxiosError<ResponseError>
		>(addressesApi.addAddress(addressRequest));

		if (addError) {
			console.error("Error adding address:", addError);

			const errRes = addError.response?.data;

			if (errRes) {
				if ("messages" in errRes) {
					const validationErrors = Object.entries(
						errRes.messages
					).map(([field, message]) => ({
						field,
						message,
					}));

					applyValidationErrors(validationErrors, form.setError);
				} else if ("message" in errRes) {
					setError(errRes.message);
				} else {
					setError("Ocurrió un error al añadir la dirección");
				}
			}

			setLoading(false);
			return;
		}

		await fetchAddresses();
		setIsAddDialogOpen(false);
		form.reset();
		setLoading(false);
	};

	// Handle updating an address
	const handleUpdateAddress = async (data: UpdateAddressFormData) => {
		if (!currentAddress) return;

		setLoading(true);
		setError("");

		const updateRequest: UpdateAddressRequest = {
			...data,
			userId,
		};

		const { error: updateError } = await tryCatch<
			AxiosResponse<Address>,
			AxiosError<ResponseError>
		>(addressesApi.updateAddress(currentAddress.id, updateRequest));

		if (updateError) {
			console.error("Error updating address:", updateError);

			const errRes = updateError.response?.data;

			if (errRes) {
				if ("messages" in errRes) {
					const validationErrors = Object.entries(
						errRes.messages
					).map(([field, message]) => ({
						field,
						message,
					}));

					applyValidationErrors(validationErrors, form.setError);
				} else if ("message" in errRes) {
					setError(errRes.message);
				} else {
					setError("Ocurrió un error al actualizar la dirección");
				}
			}

			setLoading(false);
			return;
		}

		await fetchAddresses();
		setIsEditDialogOpen(false);
		setCurrentAddress(null);
		form.reset();
		setLoading(false);
	};

	// Handle deleting an address
	const handleDeleteAddress = async () => {
		if (!deleteConfirmAddress) return;

		setLoading(true);
		setError("");

		const { error: deleteError } = await tryCatch<
			AxiosResponse<void>,
			AxiosError<ResponseError>
		>(addressesApi.deleteAddress(deleteConfirmAddress.id));

		if (deleteError) {
			console.error("Error deleting address:", deleteError);
			setError("No se pudo eliminar la dirección");
			setLoading(false);
			return;
		}

		await fetchAddresses();
		setIsDeleteDialogOpen(false);
		setDeleteConfirmAddress(null);
		setLoading(false);
	};

	// Open edit dialog with current address data
	const openEditDialog = (address: Address) => {
		setCurrentAddress(address);
		form.reset({
			street: address.street,
			city: address.city,
			state: address.state,
			zipCode: address.zipCode,
			country: address.country,
			addressType: address.addressType,
		});
		setIsEditDialogOpen(true);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Direcciones</CardTitle>
					<CardDescription>Gestione sus direcciones</CardDescription>
				</div>
				<Button
					onClick={() => {
						form.reset();
						setIsAddDialogOpen(true);
					}}
					size="sm"
				>
					<Plus className="h-4 w-4 mr-2" />
					Añadir dirección
				</Button>
			</CardHeader>
			<CardContent>
				{error && (
					<Alert variant="destructive" className="mb-4">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{loading && !addresses.length ? (
					<div className="flex justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				) : addresses.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						No tiene direcciones registradas
					</div>
				) : (
					<div className="space-y-4">
						{addresses.map((address) => (
							<Card key={address.id} className="overflow-hidden">
								<CardContent className="p-4">
									<div className="flex justify-between items-start">
										<div className="space-y-1">
											<div className="font-medium flex items-center gap-2">
												{address.street}
												<Badge
													variant={
														address.addressType ===
														AddressTypeEnum.PRIMARY
															? "default"
															: "secondary"
													}
												>
													{address.addressType ===
													AddressTypeEnum.PRIMARY
														? "Principal"
														: "Secundaria"}
												</Badge>
											</div>
											<div className="text-sm text-muted-foreground">
												{address.city}, {address.state},{" "}
												{address.zipCode}
											</div>
											<div className="text-sm text-muted-foreground">
												{address.country}
											</div>
										</div>
										<div className="flex space-x-2">
											<Button
												variant="outline"
												size="icon"
												onClick={() =>
													openEditDialog(address)
												}
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												size="icon"
												className="text-destructive"
												onClick={() => {
													setDeleteConfirmAddress(
														address
													);
													setIsDeleteDialogOpen(true);
												}}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</CardContent>

			{/* Add Address Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Añadir dirección</DialogTitle>
						<DialogDescription>
							Introduzca los detalles de la nueva dirección
						</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleAddAddress)}
							className="space-y-4"
						>
							<AddressFields form={form} baseField="" />

							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsAddDialogOpen(false)}
									disabled={loading}
								>
									Cancelar
								</Button>
								<Button type="submit" disabled={loading}>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Guardando...
										</>
									) : (
										<>
											<CheckCircle className="mr-2 h-4 w-4" />
											Guardar
										</>
									)}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Edit Address Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar dirección</DialogTitle>
						<DialogDescription>
							Modifique los detalles de la dirección
						</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleUpdateAddress)}
							className="space-y-4"
						>
							<AddressFields form={form} />

							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsEditDialogOpen(false)}
									disabled={loading}
								>
									Cancelar
								</Button>
								<Button type="submit" disabled={loading}>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Actualizando...
										</>
									) : (
										<>
											<CheckCircle className="mr-2 h-4 w-4" />
											Actualizar
										</>
									)}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Eliminar dirección</DialogTitle>
						<DialogDescription>
							¿Está seguro de que desea eliminar esta dirección?
							Esta acción no se puede deshacer.
						</DialogDescription>
					</DialogHeader>

					{deleteConfirmAddress && (
						<div className="py-3">
							<p className="font-medium">
								{deleteConfirmAddress.street}
							</p>
							<p className="text-sm text-muted-foreground">
								{deleteConfirmAddress.city},{" "}
								{deleteConfirmAddress.state},{" "}
								{deleteConfirmAddress.zipCode}
							</p>
							<p className="text-sm text-muted-foreground">
								{deleteConfirmAddress.country}
							</p>
						</div>
					)}

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
							disabled={loading}
						>
							<X className="mr-2 h-4 w-4" />
							Cancelar
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={handleDeleteAddress}
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Eliminando...
								</>
							) : (
								<>
									<Trash2 className="mr-2 h-4 w-4" />
									Eliminar
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
