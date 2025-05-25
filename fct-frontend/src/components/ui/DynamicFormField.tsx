import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

export interface FieldConfig {
	label: string;
	placeholder?: string;
	type: string;
	disabled?: boolean;
	options?: {
		value: string;
		label: string;
	}[];
}

interface DynamicFormFieldProps<T extends FieldValues> {
	name: FieldPath<T>;
	control: Control<T>;
	fieldConfigs: Record<string, FieldConfig>;
	disabled?: boolean;
}

export function DynamicFormField<T extends FieldValues>({
	name,
	control,
	fieldConfigs,
	disabled = false,
}: DynamicFormFieldProps<T>) {
	const fieldKey = String(name).split(".").pop() as string;
	const config = fieldConfigs[fieldKey];

	if (!config) {
		console.error(
			`Configuration not found for field: ${name}, key: ${fieldKey}`,
		);
		return null;
	}

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{config.label}</FormLabel>
					<FormControl>
						{(() => {
							switch (config.type) {
								case "textarea":
									return (
										<Textarea
											placeholder={config.placeholder}
											{...field}
											disabled={
												disabled || config.disabled
											}
										/>
									);
								case "select":
									return (
										<Select
											onValueChange={field.onChange}
											value={String(field.value ?? "")}
											disabled={
												disabled || config.disabled
											}
										>
											<SelectTrigger>
												<SelectValue
													placeholder={
														config.placeholder
													}
												/>
											</SelectTrigger>
											<SelectContent
												position="popper"
												sideOffset={5}
											>
												{config.options?.map(
													(option) => (
														<SelectItem
															key={option.value}
															value={option.value}
														>
															{option.label}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
									);
								case "file":
									return (
										<Input
											type="file"
											accept="image/*"
											ref={field.ref}
											name={field.name}
											onBlur={field.onBlur}
											onChange={(e) => {
												const file = (
													e.target as HTMLInputElement
												).files?.[0];
												field.onChange(
													file ?? undefined,
												);
											}}
											disabled={
												disabled || config.disabled
											}
										/>
									);
								default:
									return (
										<Input
											placeholder={config.placeholder}
											type={config.type}
											{...field}
											onChange={(e) => {
												let value: string | number =
													e.target.value;
												if (config.type === "number") {
													value =
														e.target.value === ""
															? ""
															: Number(
																	e.target
																		.valueAsNumber ||
																		e.target
																			.value,
																);
												}
												field.onChange(value);
											}}
											disabled={
												disabled || config.disabled
											}
										/>
									);
							}
						})()}
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
