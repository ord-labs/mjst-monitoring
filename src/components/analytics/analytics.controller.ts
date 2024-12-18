import { NextFunction, Request, Response } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import Manuscript from "../manuscript/manuscript.model";
import Reviewer from "../reviewer/reviewer.model";
import Editor from "../editor/editor.model";

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalManuscripts: number = await Manuscript.countDocuments();
        const preReviewCount: number = await Manuscript.countDocuments({ status: "Pre-Review" });
        const doubleBlindCount: number = await Manuscript.countDocuments({ status: "Double-Blind" });
        const acceptedCount: number = await Manuscript.countDocuments({ status: ["Layouting", "Final Proofreading"] });
        const publishedCount: number = await Manuscript.countDocuments({ status: "Published" });
        const rejectedCount: number = await Manuscript.countDocuments({ status: "Rejected" });
        const uploadCount: number = totalManuscripts;
        const reviewersCount: number = await Reviewer.countDocuments();
        const editorsCount: number = await Editor.countDocuments();

        const statusDistribution = {
            preReview: (preReviewCount / totalManuscripts) * 100,
            doubleBlind: (doubleBlindCount / totalManuscripts) * 100,
            accepted: (acceptedCount / totalManuscripts) * 100
        };

        const typeDistribution = {
            published: (publishedCount / totalManuscripts) * 100,
            rejected: (rejectedCount / totalManuscripts) * 100
        };

        const year = new Date().getFullYear();

        const result = await Manuscript.aggregate([
            {
                $match: {
                    created_at: {
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${year + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$created_at" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.month": 1 }
            }
        ]);

        const countsByMonth = Array.from({ length: 12 }, (_, i) => {
            const monthData = result.find((r) => r._id.month === i + 1);
            return { month: i + 1, count: monthData ? monthData.count : 0 };
        });

        return jsonResponse(res, {
            status: 200,
            message: "Analytics fetched successfully",
            data: {
                preReviewCount,
                doubleBlindCount,
                acceptedCount,
                publishedCount,
                rejectedCount,
                uploadCount,
                reviewersCount,
                editorsCount,
                statusDistribution,
                countsByMonth,
                typeDistribution,
                totalManuscripts
            }
        });
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};
