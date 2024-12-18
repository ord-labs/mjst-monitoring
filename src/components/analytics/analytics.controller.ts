import { NextFunction, Request, Response } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import Manuscript from "../manuscript/manuscript.model";
import Reviewer from "../reviewer/reviewer.model";
import Editor from "../editor/editor.model";

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalManuscripts: number = await Manuscript.countDocuments();
        const preReview: number = await Manuscript.countDocuments({ status: "Pre-Review" });
        const doubleBlind: number = await Manuscript.countDocuments({ status: "Double-Blind" });
        const accepted: number = await Manuscript.countDocuments({ status: ["Layouting", "Final Proofreading"] });
        const published: number = await Manuscript.countDocuments({ status: "Published" });
        const rejected: number = await Manuscript.countDocuments({ status: "Rejected" });
        const upload: number = totalManuscripts;
        const reviewers: number = await Reviewer.countDocuments();
        const editors: number = await Editor.countDocuments();

        const statusDistribution = {
            preReview: (preReview / totalManuscripts) * 100,
            doubleBlind: (doubleBlind / totalManuscripts) * 100,
            accepted: (accepted / totalManuscripts) * 100
        };

        const typeDistribution = {
            published: (published / totalManuscripts) * 100,
            rejected: (rejected / totalManuscripts) * 100
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
                preReview,
                doubleBlind,
                accepted,
                published,
                rejected,
                upload,
                reviewers,
                editors,
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
