import { Request, Response, NextFunction } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import { sendEmail } from "../../utils/mailer";

export const sendMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message, subject, recipients } = req.body;

        const mail = await sendEmail(recipients, subject, message);

        if (mail) {
            return jsonResponse(res, { status: 200, message: "Email sent successfully" });
        } else {
            return next(errorResponse(400, "Failed to send email"));
        }
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};
