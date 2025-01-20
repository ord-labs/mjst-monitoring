import { NextFunction, Request, Response } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

export const authenticateUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        var result = imagekit.getAuthenticationParameters();
        res.send(result);
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};
