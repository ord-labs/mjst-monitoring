import { Request, Response, NextFunction } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import { sendEmail } from "../../utils/mailer";

export const sendMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const msg = req.body.message;

        const mail = await sendEmail(["timajokyle24@gmail.com"], "Sample Subject", msg);

        if (mail) {
            return jsonResponse(res, { status: 200, message: "Email sent successfully" });
        } else {
            return next(errorResponse(400, "Failed to send email"));
        }
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};
