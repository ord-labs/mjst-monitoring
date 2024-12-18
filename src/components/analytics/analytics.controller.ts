import { NextFunction, Request, Response } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import Manuscript from "../manuscript/manuscript.model";
import Reviewer from "../reviewer/reviewer.model";
import Editor from "../editor/editor.model";

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

        const totalManuscripts: number = await Manuscript.countDocuments({
            created_at: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        });
        const preReviewCount: number = await Manuscript.countDocuments({
            status: "Pre-Review",
            created_at: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        });
        const doubleBlindCount: number = await Manuscript.countDocuments({
            status: "Double-Blind",
            created_at: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        });
        const acceptedCount: number = await Manuscript.countDocuments({
            status: ["Layouting", "Final Proofreading"],
            created_at: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        });
        const publishedCount: number = await Manuscript.countDocuments({
            status: "Published",
            created_at: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        });
        const rejectedCount: number = await Manuscript.countDocuments({
            status: "Rejected",
            created_at: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        });
        const uploadCount: number = totalManuscripts;
        const reviewersCount: number = await Reviewer.countDocuments({
            created_at: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        });
        const editorsCount: number = await Editor.countDocuments({
            created_at: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        });

        // const statusDistributionCount: number = preReviewCount + doubleBlindCount + acceptedCount;
        // const typeDistributionCount: number = uploadCount + publishedCount + rejectedCount;

        // const statusDistribution = {
        //     preReviewCount: (preReviewCount / statusDistributionCount) * 100,
        //     doubleBlindCount: (doubleBlindCount / statusDistributionCount) * 100,
        //     acceptedCount: (acceptedCount / statusDistributionCount) * 100,
        //     statusDistributionCount
        // };

        // const typeDistribution = {
        //     uploadCount: (uploadCount / typeDistributionCount) * 100,
        //     publishedCount: (publishedCount / typeDistributionCount) * 100,
        //     rejectedCount: (rejectedCount / typeDistributionCount) * 100,
        //     typeDistributionCount
        // };

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
            return monthData ? monthData.count : 0;
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
                countsByMonth,
                totalManuscripts
            }
        });
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};
