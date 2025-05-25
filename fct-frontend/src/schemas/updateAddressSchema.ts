import { z } from "zod";
import { AddressTypeEnum } from "@/api/models";

export const updateAddressSchema = z.object({
  street: z.string().nonempty("La calle no puede estar vacía").trim(),
  city: z.string().nonempty("La ciudad no puede estar vacía").trim(),
  state: z.string().nonempty("El estado/provincia no puede estar vacío").trim(),
  zipCode: z.string().nonempty("El código postal no puede estar vacío").trim(),
  country: z.string().nonempty("El país no puede estar vacío").trim(),
  addressType: z.nativeEnum(AddressTypeEnum, {
    errorMap: () => ({ message: "El tipo de dirección es inválido" }),
  }),
});

export type UpdateAddressFormData = z.infer<typeof updateAddressSchema>; 