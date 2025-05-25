import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PaymentFormData, paymentSchema } from "@/schemas/paymentSchema";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CheckCircle, Loader2 } from "lucide-react";

interface PaymentFormProps {
	form: UseFormReturn<PaymentFormData>;
	error: string | null;
	success: string | null;
	subtotal: number;
	isLoading: boolean;
	onSubmit: (data: z.infer<typeof paymentSchema>) => void;
}

export default function PaymentForm({
	form,
	error,
	success,
	subtotal,
	isLoading,
	onSubmit,
}: PaymentFormProps) {
	return (
		<section className="space-y-4">
			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			{success && (
				<Alert variant="success">
					<AlertDescription>{success}</AlertDescription>
				</Alert>
			)}
			<h3 className="text-xl font-medium">Información de Pago</h3>
			<Card>
				<CardHeader>
					<CardTitle>Detalles de la Tarjeta</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							className="space-y-4"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<FormField
								control={form.control}
								name="cardNumber"
								render={({ field }) => (
									<FormItem className="space-y-1.5">
										<FormLabel>Número de Tarjeta</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												placeholder="•••• •••• •••• ••••"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="expiryDate"
								render={({ field }) => (
									<FormItem className="space-y-1.5">
										<FormLabel>
											Fecha de Caducidad
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="date"
												placeholder="MM / YY"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="cvc"
								render={({ field }) => (
									<FormItem className="space-y-1.5">
										<FormLabel>CVC</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												placeholder="•••"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="cardName"
								render={({ field }) => (
									<FormItem className="space-y-1.5">
										<FormLabel>
											Nombre en la Tarjeta
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="text"
												placeholder="Nombre Apellido"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								{isLoading ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<CheckCircle className="mr-2 h-4 w-4" />
								)}
								Pagar Ahora €{subtotal.toFixed(2)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</section>
	);
}
