import { Schema, model, Document, Types } from "mongoose";

export interface ReviewerDoc extends Document {
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    position: "Chief Editor" | "Assistant Editor" | "Director";
    department: string;
    profileLink: string;
}

const ReviewerSchema = new Schema<ReviewerDoc>(
    {
        firstname: { type: String, required: true },
        middlename: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true },
        position: { type: String, required: true },
        department: { type: String, required: true },
        profileLink: { type: String, default: null }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

export default model<ReviewerDoc>("Reviewer", ReviewerSchema);
