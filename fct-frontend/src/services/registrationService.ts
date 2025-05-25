import { AddressesApi, DefaultApi, RegisterResponse } from "@/api";
import { AxiosError, AxiosResponse } from "axios";
import { tryCatch } from "@/lib/tryCatch";
import { AddressFormData } from "@/schemas/addressSchema";
import { RegisterFormData } from "@/schemas/registerSchema";
import { ResponseError } from "@/types/errors";

// Define the combined type without creating a new schema
type RegisterWithAddressFormData = RegisterFormData & {
  address: AddressFormData;
};

export interface RegistrationResult {
  success: boolean;
  userId?: number;
  error?: string;
  validationErrors?: Array<{ field: string; message: string }>;
}

/**
 * Service to handle user registration with address
 */
export const registrationService = {
  /**
   * Register a new user with address
   * @param formData The form data containing user and address info
   * @returns A result object with status and error information
   */
  async registerWithAddress(formData: RegisterWithAddressFormData): Promise<RegistrationResult> {
    const defaultApi = new DefaultApi();
    const addressesApi = new AddressesApi();
    
    // Extract user and address data
    const { address, ...userData } = formData;
    
    // Step 1: Register the user
    const { data: registerData, error: registerError } = await tryCatch<
      AxiosResponse<RegisterResponse>,
      AxiosError<ResponseError>
    >(defaultApi.register({ ...userData }));
    
    // Handle registration errors
    if (registerError) {
      console.error("Registration error:", registerError);
      
      const errRes = registerError.response?.data;
      if (errRes) {
        if ("messages" in errRes) {
          const validationErrors = Object.entries(
            errRes.messages,
          ).map(([field, message]) => ({
            field,
            message,
          }));
          
          return {
            success: false,
            error: "Validation error",
            validationErrors,
          };
        } else if ("message" in errRes) {
          return {
            success: false,
            error: errRes.message,
          };
        }
      }
      
      return {
        success: false,
        error: "Ocurrió un error inesperado durante el registro.",
      };
    }
    
    // Step 2: If user registration successful, add the address
    if (registerData?.data?.userId) {
      const userId = registerData.data.userId;
      
      const { error: addressError } = await tryCatch(
        addressesApi.addAddress({
          ...address,
          userId,
        })
      );
      
      if (addressError) {
        console.error("Address creation error:", addressError);
        // Registration is still considered successful even if address creation failed
        return {
          success: true,
          userId,
          error: "Usuario registrado, pero hubo un error al guardar la dirección.",
        };
      }
      
      return {
        success: true,
        userId,
      };
    }
    
    return {
      success: false,
      error: "Registro incompleto. No se pudo obtener el ID de usuario.",
    };
  }
}; 