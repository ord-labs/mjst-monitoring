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
        const manuscript = await Manuscript.findOne({ _id: req.query.manuscriptId }, null, { lean: true })
            .populate(["editor", "reviewers"])
            .lean()
            .exec();

        if (manuscript) {
            return jsonResponse(res, { status: 200, message: "Manuscript fetched successfully", data: manuscript });
        }
        return next(errorResponse(400, "Manuscript not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

const getManuscriptByStatusYearFilter = (status: string | undefined, year?: number) => {
    if (status && year) {
        return {
            status,
            created_at: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        };
    }

    if (year && !status) {
        return {
            created_at: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        };
    }

    return {
        status
    };
};

export const getManuscriptByEditor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const editor: string | undefined = req.body.editor as string;

        const filter = { editor, status: "Pre-Review" };

        const manuscripts = await Manuscript.find(filter)
            .populate({
                path: "editor",
                select: "firstname middlename lastname email position department profileLink"
            })
            .populate(["editor", "reviewers"])
            .exec();

        if (manuscripts) {
            return jsonResponse(res, { status: 200, message: "Manuscripts fetched successfully", data: manuscripts });
        }
        return next(errorResponse(400, "Manuscripts not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

export const getManuscriptByReviewer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the reviewer's ID or email from the request body
        const reviewerId: string = req.body.reviewer as string;

        if (!reviewerId) {
            return next(errorResponse(400, "Reviewer ID is required"));
        }

        // Query to match the reviewer's ID in the 'reviewers' array
        const filter = { reviewers: { $in: [reviewerId] }, status: "Double-Blind" };

        // Fetch manuscripts that match the filter, including populated fields for editor and reviewers
        const manuscripts = await Manuscript.find(filter)
            .populate({
                path: "editor",
                select: "firstname middlename lastname email position department profileLink"
            })
            .populate({
                path: "reviewers",
                select: "firstname middlename lastname email position department profileLink"
            })
            .exec();

        if (manuscripts.length > 0) {
            return jsonResponse(res, { status: 200, message: "Manuscripts fetched successfully", data: manuscripts });
        }

        return next(errorResponse(404, "No manuscripts found for the specified reviewer"));
    } catch (e) {
        // Handle any errors and pass them to the next middleware
        return next(errorResponse(500, (e as Error).message));
    }
};

export const getManuscriptByStepStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const status: string | undefined = req.query.status as string;
        const year = Number(req.query.year);

        const filter = getManuscriptByStatusYearFilter(status, year);

        const manuscripts = await Manuscript.find(filter)
            .populate({
                path: "editor",
                select: "firstname middlename lastname email position department profileLink"
            })
            .populate(["editor", "reviewers"])
            .exec();

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

        const fileCodeNumber = await generateFileCodeNumber(newManuscript.scopeCode);

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

const baseCount = {
    EA: 1087,
    IA: 905,
    ECBE: 1285,
    ICBE: 942,
    EECT: 1458,
    IECT: 1009,
    EMSP: 977,
    IMSP: 914,
    ORS: 1160
};

const generateFileCodeNumber = async (scopeCode) => {
    try {
        const count = await Manuscript.countDocuments({
            fileCode: { $regex: `^${scopeCode}`, $options: "i" } // 'i' makes it case-insensitive
        });

        console.log(count);
        return count + baseCount[scopeCode] + 1;
    } catch (error) {
        return 0;
    }
};
