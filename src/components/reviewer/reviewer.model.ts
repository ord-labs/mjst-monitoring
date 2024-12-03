import { Schema, model, Document, Types } from "mongoose";

export interface ReviewerDoc extends Document {
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    affiliation: string;
    fieldOfExpertise: string;
    publicationLink: string;
}

const ReviewerSchema = new Schema<ReviewerDoc>(
    {
        firstname: { type: String, required: true },
        middlename: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true },
        affiliation: { type: String, required: true },
        fieldOfExpertise: { type: String, required: true },
        publicationLink: { type: String, required: true }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

export default model<ReviewerDoc>("Reviewer", ReviewerSchema);
