import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../interfaces/ErrorResponse";
import createError, { HttpError } from "http-errors";

const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404);
    const error = createError(404, "Not Found");
    next(error);
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: HttpError, req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
    const statusCode: number = err.statusCode ?? 400;

    res.status(statusCode);
    res.json({
        message: err.message,
        error: err.error || null
    });
};

export { notFound, errorHandler };
