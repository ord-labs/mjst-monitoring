import { NextFunction, Request, Response } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import { createReviewerSchema, deleteReviewerSchema, updateReviewerSchema } from "../reviewer/reviewer.schema";
import { extractErrorMessage } from "../../utils/extractJoiError";
import Reviewer from "./reviewer.model";
import { generateToken } from "../../utils/jwtHelper";
import { loginUserByCredentialsSchema } from "../user/user.schema";

/*
 * Extra Handlers
 */
const getReviewerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewer = await Reviewer.findOne({ _id: req.query.reviewerId });

        if (reviewer) {
            return jsonResponse(res, { status: 200, message: "Reviewer fetched successfully", data: reviewer });
        }
        return next(errorResponse(400, "Reviewer not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

export const getReviewers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewers = await Reviewer.find();
        if (reviewers) {
            return jsonResponse(res, { status: 200, message: "Reviewers fetched successfully", data: reviewers });
        }
        return next(errorResponse(400, "No reviewers found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Get reviewer by Id
 * @route GET /api/v1/reviewer?reviewerId=id
 * @params QUERY reviewerId:string
 *
 * Get reviewers
 * @route GET /api/v1/reviewer
 */

export const getReviewer = async (req: Request, res: Response, next: NextFunction) => {
    const { reviewerId } = req.query;
    if (reviewerId) {
        return getReviewerById(req, res, next);
    }

    return getReviewers(req, res, next);
};

/*
 * Create new reviewer
 * @route POST /api/v1/reviewer
 * @params BODY createReviewerSchema
 */
export const createReviewer = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = createReviewerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        // Check if email already exist
        const reviewerExists = await Reviewer.findOne({ email: req.body.email });
        if (reviewerExists) {
            return next(errorResponse(400, "Email already taken by another reviewer"));
        }

        const newReviewer = await Reviewer.create(req.body);

        if (newReviewer) {
            const token: string = generateToken({ _id: newReviewer._id });
            return jsonResponse(res, {
                status: 201,
                message: "Reviewer created successfully",
                data: {
                    newReviewer,
                    token
                }
            });
        }
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

export const loginReviewerByCredentials = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = loginUserByCredentialsSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const reviewer = await Reviewer.findOne({ email: req.body.email });
        if (reviewer) {
            const validPassword = await reviewer.isValidPassword(req.body.password);

            if (validPassword) {
                const token: string = generateToken({ _id: reviewer._id });
                return jsonResponse(res, { status: 200, message: "Login successful", data: { token, reviewer } });
            }

            return next(errorResponse(401, "Invalid email or password"));
        }

        return next(errorResponse(401, "Invalid email or password"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Update reviewer
 * @route PUT /api/v1/reviewer
 * @params updateReviewerSchema
 */
export const updateReviewer = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateReviewerSchema.validate(
        { ...req.body, reviewerId: req.params.reviewerId },
        { abortEarly: false }
    );
    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const id: string = req.params.reviewerId;

        const reviewer = await Reviewer.findOneAndUpdate({ _id: id }, req.body, { new: true });

        if (reviewer) {
            return jsonResponse(res, {
                status: 200,
                message: "Reviewer updated successfully",
                data: reviewer
            });
        }

        return next(errorResponse(400, "Reviewer not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Delete/Soft Delete reviewer
 * @route DELETE /api/v1/reviewer
 * @params updateReviewerSchema
 */
export const deleteReviewer = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = deleteReviewerSchema.validate(
        { ...req.body, reviewerId: req.params.reviewerId },
        { abortEarly: false }
    );
    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const id: string = req.params.reviewerId;

        const deletedReviewer = await Reviewer.findOneAndDelete({ _id: id });

        if (deletedReviewer) {
            return jsonResponse(res, {
                status: 200,
                message: "Reviewer deleted successfully",
                data: deletedReviewer
            });
        }

        return next(errorResponse(400, "Reviewer not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};
