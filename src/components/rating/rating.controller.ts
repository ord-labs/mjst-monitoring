import { NextFunction, Request, Response } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import { extractErrorMessage } from "../../utils/extractJoiError";
import Rating from "./rating.model";
import { generateQueryFilters } from "../../utils/queryHelper";

/*
 * Extra Handlers
 */
const getRatingByField = async (req: Request, res: Response, next: NextFunction) => {
    const ratingFilters = generateQueryFilters(
        req.query,
        ["ratingId", "manuscriptId", "reviewerId", "rating"],
        (query) => {
            if (query.ratingId) {
                query._id = query.ratingId;
                delete query.ratingId;
            }
        }
    );

    try {
        const rating = await Rating.findOne(ratingFilters);

        if (rating) {
            return jsonResponse(res, { status: 200, message: "Rating fetched successfully", data: rating });
        }
        return next(errorResponse(400, "Rating not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

export const getRatings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ratings = await Rating.find();
        if (ratings) {
            return jsonResponse(res, { status: 200, message: "Ratings fetched successfully", data: ratings });
        }
        return next(errorResponse(400, "No ratings found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Get rating by Id
 * @route GET /api/v1/rating?ratingId=id
 * @params QUERY ratingId:string
 *
 * Get ratings
 * @route GET /api/v1/rating
 */

export const getRating = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query) {
        return getRatingByField(req, res, next);
    }

    return getRatings(req, res, next);
};

/*
 * Create new rating
 * @route POST /api/v1/rating
 * @params BODY createRatingSchema
 */
export const createRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { manuscriptId, reviewerId, remarks } = req.body;
        let rating: any = {};
        let status: number = 200;

        const existingRating = await Rating.findOne({ manuscriptId, reviewerId });

        if (existingRating) {
            rating = await Rating.findOneAndUpdate({ _id: existingRating._id }, req.body, { new: true });
        } else {
            rating = await Rating.create(req.body);
            status = 201;
        }

        if (rating) {
            return jsonResponse(res, {
                status,
                message: "Rating created successfully",
                data: {
                    rating
                }
            });
        }
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Update rating
 * @route PUT /api/v1/rating
 * @params updateRatingSchema
 */
export const updateRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.ratingId;

        const rating = await Rating.findOneAndUpdate({ _id: id }, req.body, { new: true });

        if (rating) {
            return jsonResponse(res, {
                status: 200,
                message: "Rating updated successfully",
                data: rating
            });
        }

        return next(errorResponse(400, "Rating not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Delete/Soft Delete rating
 * @route DELETE /api/v1/rating
 * @params updateRatingSchema
 */
export const deleteRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.ratingId;

        const deletedRating = await Rating.findOneAndDelete({ _id: id });

        if (deletedRating) {
            return jsonResponse(res, {
                status: 200,
                message: "Rating deleted successfully",
                data: deletedRating
            });
        }

        return next(errorResponse(400, "Rating not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};
