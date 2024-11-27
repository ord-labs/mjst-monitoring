import { Response } from "express";
import { JsonReponse } from "../interfaces/ApiResponse";
import createError from "http-errors";

export const jsonResponse = (res: Response, responseData: JsonReponse): Response => {
    const { status, message, data } = responseData;

    return res.status(status).json({ message, data, status});
};

export const errorResponse = (status: number, message: string, errorData?: string | string[] | object | object[]) => {
    const error = createError(status, message);
    error.error = errorData ?? message;

    return error;
};
