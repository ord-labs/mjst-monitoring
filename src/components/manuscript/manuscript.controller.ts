import { NextFunction, Request, Response } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import { deleteManuscriptSchema } from "../manuscript/manuscript.schema";
import { extractErrorMessage } from "../../utils/extractJoiError";
import Manuscript from "./manuscript.model";

/*
 * Extra Handlers
 */
const getManuscriptById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const manuscript = await Manuscript.findOne({ _id: req.query.manuscriptId })
            .populate(["editor", "reviewers"])
            .exec();

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
        let stepQuery = req.query.stepStatus;
        let stepStatus = "";

        if (stepQuery === "pre-review") {
            stepStatus = "Pre-Review";
        }

        if (stepQuery === "double-blind") {
            stepStatus = "Double-Blind";
        }

        if (stepQuery === "layouting") {
            stepStatus = "Layouting";
        }

        if (stepQuery === "final-proofreading") {
            stepStatus = "Final Proofreading";
        }

        const manuscripts = await Manuscript.find({ stepStatus }).populate({
            path: "editor",
            select: "firstname middlename lastname email position department profileLink"
        });

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
        const manuscripts = await Manuscript.find().populate(["editor", "reviewers"]).exec();
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
    try {
        let newManuscript = req.body;

        const docCount = (await countManuscriptStartingWith(newManuscript.scopeCode)) + 1;
        const fileCodeNumber = formatFileCodeNumber(docCount);

        newManuscript.fileCode = `${newManuscript.scopeCode}${fileCodeNumber}`;

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
    try {
        const id: string = req.params.manuscriptId;

        const manuscript = await Manuscript.findOneAndUpdate({ _id: id }, req.body, { new: true });

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

const countManuscriptStartingWith = async (scopeCode) => {
    try {
        const count = await Manuscript.countDocuments({
            fileCode: { $regex: `^${scopeCode}`, $options: "i" } // 'i' makes it case-insensitive
        });
        return count;
    } catch (error) {
        return 0;
    }
};

const formatFileCodeNumber = (count) => {
    switch (count.toString().length) {
        case 1:
            return `000${count}`;
        case 2:
            return `00${count}`;
        case 3:
            return `0${count}`;
        default:
            return count.toString();
    }
};
