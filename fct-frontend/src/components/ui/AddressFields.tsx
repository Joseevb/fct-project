import { FieldPath, UseFormReturn } from "react-hook-form";
import {
	DynamicFormField,
	FieldConfig,
} from "@/components/ui/DynamicFormField";
import { AddressTypeEnum } from "@/api/models";

const addressFieldConfigs: Record<string, FieldConfig> = {
	street: {
		label: "Calle",
		placeholder: "Introduzca su calle",
		type: "text",
	},
	city: {
		label: "Ciudad",
		placeholder: "Introduzca su ciudad",
		type: "text",
	},
	state: {
		label: "Estado/Provincia",
		placeholder: "Introduzca su estado o provincia",
		type: "text",
	},
	zipCode: {
		label: "Código Postal",
		placeholder: "Introduzca su código postal",
		type: "text",
	},
	country: {
		label: "País",
		placeholder: "Introduzca su país",
		type: "text",
	},
	addressType: {
		label: "Tipo de Dirección",
		placeholder: "Seleccione el tipo de dirección",
		type: "select",
		options: [
			{ value: AddressTypeEnum.PRIMARY, label: "Principal" },
			{ value: AddressTypeEnum.SECONDARY, label: "Secundaria" },
		],
	},
};

interface AddressFieldsProps<T extends Record<string, unknown>> {
	form: UseFormReturn<T>;
	baseField?: string; // Optional base field name for nested form data
}

export function AddressFields<T extends Record<string, unknown>>({
	form,
	baseField = "address",
}: AddressFieldsProps<T>) {
	const getFieldName = (field: string): FieldPath<T> =>
		baseField
			? (`${baseField}.${field}` as FieldPath<T>)
			: (field as FieldPath<T>);

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">Información de Dirección</h3>

			{Object.keys(addressFieldConfigs).map((fieldName) => (
				<DynamicFormField<T>
					key={fieldName}
					name={getFieldName(fieldName)}
					fieldConfigs={addressFieldConfigs}
					control={form.control}
				/>
			))}
		</div>
	);
}
