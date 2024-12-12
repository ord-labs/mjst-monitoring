import { NextFunction, Request, Response } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import {
    createManuscriptSchema,
    deleteManuscriptSchema,
    updateManuscriptSchema
} from "../manuscript/manuscript.schema";
import { extractErrorMessage } from "../../utils/extractJoiError";
import bcrypt from "bcrypt";
import Manuscript from "./manuscript.model";

/*
 * Extra Handlers
 */
const getManuscriptById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const manuscript = await Manuscript.findOne({ _id: req.query.manuscriptId });

        if (manuscript) {
            return jsonResponse(res, { status: 200, message: "Manuscript fetched successfully", data: manuscript });
        }
        return next(errorResponse(400, "Manuscript not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

export const getManuscriptByStepStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { stepStatus } = req.body;

        const manuscripts = await Manuscript.find({ stepStatus });

        if (manuscripts) {
            return jsonResponse(res, { status: 200, message: "Manuscripts fetched successfully", data: manuscripts });
        }
        return next(errorResponse(400, "Manuscripts not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

const getManuscripts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const manuscripts = await Manuscript.find();
        if (manuscripts) {
            return jsonResponse(res, { status: 200, message: "Manuscripts fetched successfully", data: manuscripts });
        }
        return next(errorResponse(400, "No manuscripts found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Get manuscript by Id
 * @route GET /api/v1/manuscript?manuscriptId=id
 * @params QUERY manuscriptId:string
 *
 * Get manuscripts
 * @route GET /api/v1/manuscript
 */

export const getManuscript = async (req: Request, res: Response, next: NextFunction) => {
    const { manuscriptId } = req.query;
    if (manuscriptId) {
        return getManuscriptById(req, res, next);
    }

    return getManuscripts(req, res, next);
};

/*
 * Create new manuscript
 * @route POST /api/v1/manuscript
 * @params BODY createManuscriptSchema
 */
export const createManuscript = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = createManuscriptSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        let newManuscript = req.body;

        const docCount = Manuscript.countDocuments();

        newManuscript.fileCode = `${newManuscript.fieldScopeAbbr}${docCount}`;

        const manuscript = await Manuscript.create(newManuscript);

        if (manuscript) {
            return jsonResponse(res, {
                status: 201,
                message: "Manuscript created successfully",
                data: {
                    manuscript
                }
            });
        }
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Update manuscript
 * @route PUT /api/v1/manuscript
 * @params updateManuscriptSchema
 */
export const updateManuscript = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateManuscriptSchema.validate(
        { ...req.body, manuscriptId: req.params.manuscriptId },
        { abortEarly: false }
    );
    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const id: string = req.params.manuscriptId;

        const manuscript = await Manuscript.findOneAndUpdate({ _id: id, status: true }, req.body, { new: true });

        if (manuscript) {
            return jsonResponse(res, {
                status: 200,
                message: "Manuscript updated successfully",
                data: manuscript
            });
        }

        return next(errorResponse(400, "Manuscript not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Delete/Soft Delete manuscript
 * @route DELETE /api/v1/manuscript
 * @params updateManuscriptSchema
 */
export const deleteManuscript = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = deleteManuscriptSchema.validate(
        { ...req.body, manuscriptId: req.params.manuscriptId },
        { abortEarly: false }
    );
    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const id: string = req.params.manuscriptId;

        const deletedManuscript = await Manuscript.findOneAndDelete({ _id: id });

        if (deletedManuscript) {
            return jsonResponse(res, {
                status: 200,
                message: "Manuscript deleted successfully",
                data: deletedManuscript
            });
        }

        return next(errorResponse(400, "Manuscript not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};
