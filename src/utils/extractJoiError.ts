import { ValidationError } from "joi";

export const extractErrorMessage = (error: ValidationError): string[] => {
    return error.details.map((detail: any) => detail.message.replaceAll('"', ""));
};
