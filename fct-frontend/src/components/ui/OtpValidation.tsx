import { DefaultApi, ErrorMessage } from "@/api";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { tryCatch } from "@/lib/tryCatch";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./button";

const FormSchema = z.object({
	pin: z.string().min(6).max(6),
});

interface OtpValidationProps {
	setIsOtp: (isOtp: boolean) => void;
}

export default function OtpValidation({
	setIsOtp,
}: Readonly<OtpValidationProps>) {
	const form = useForm<z.infer<typeof FormSchema>>({
		defaultValues: {
			pin: "",
		},
		resolver: zodResolver(FormSchema),
	});

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		const api = new DefaultApi();

		const { error } = await tryCatch<
			AxiosResponse<{ [key: string]: string }>,
			AxiosError<ErrorMessage>
		>(api.verifyEmail(data.pin));

		if (error) {
			form.setError("pin", {
				message: error.response?.data.message || "Error al verificar",
			});
			return;
		}

		setIsOtp(false);
	};

	return (
		<div className="flex h-screen w-full flex-col items-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col justify-center items-center gap-4 border rounded-md p-6 shadow-lg mt-20"
				>
					<FormField
						control={form.control}
						name="pin"
						render={({ field }) => (
							<FormItem className="flex flex-col items-center justify-center">
								<FormLabel>Validar Email</FormLabel>
								<FormControl>
									<InputOTP
										maxLength={6}
										inputMode="numeric"
										{...field}
									>
										<InputOTPGroup>
											<InputOTPSlot index={0} />
											<InputOTPSlot index={1} />
											<InputOTPSlot index={2} />
										</InputOTPGroup>
										<InputOTPSeparator />
										<InputOTPGroup>
											<InputOTPSlot index={3} />
											<InputOTPSlot index={4} />
											<InputOTPSlot index={5} />
										</InputOTPGroup>
									</InputOTP>
								</FormControl>
								<FormDescription>
									Introduzca el código de verificación
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" variant="default">
						Validar
					</Button>
				</form>
			</Form>
		</div>
	);
}
