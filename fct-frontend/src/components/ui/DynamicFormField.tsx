import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./textarea";

interface FieldConfig {
	label: string;
	placeholder?: string;
	type: string;
	disabled?: boolean;
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
	const config = fieldConfigs[name as keyof typeof fieldConfigs];

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{config.label}</FormLabel>
					<FormControl>
						{config.type === "textarea" ? (
							<Textarea
								placeholder={config.placeholder}
								{...field}
								disabled={disabled || config.disabled}
							/>
						) : (
							<Input
								placeholder={config.placeholder}
								type={config.type}
								{...field}
								onChange={(e) => {
									let value: unknown = e.target.value;
									if (config.type === "number") {
										value =
											e.target.value === ""
												? 0
												: Number(e.target.value);
									}
									field.onChange(value);
								}}
								disabled={disabled || config.disabled}
							/>
						)}
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
