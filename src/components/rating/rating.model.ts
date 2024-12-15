import { Schema, model, Document, Types } from "mongoose";

export interface RatingDoc extends Document {
    reviewerId: Types.ObjectId;
    manuscriptId: Types.ObjectId;
    remarks: string;
}

const RatingSchema = new Schema<RatingDoc>(
    {
        reviewerId: { type: Schema.Types.ObjectId, ref: "Reviewer" },
        manuscriptId: { type: Schema.Types.ObjectId, ref: "Manuscript" },
        remarks: { type: String, default: null }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

export default model<RatingDoc>("Rating", RatingSchema);
