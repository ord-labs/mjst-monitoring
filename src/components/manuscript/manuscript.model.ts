import { Schema, model, Document, Types } from "mongoose";

export enum ManuscriptStatus {
    IN_PROGRESS = "in progress",
    FOR_REVISION = "for revision",
    PUBLISHED = "published"
}

export interface ManuscriptDoc extends Document {
    fileCode: string;
    title: string;
    scope: string;
    scopeCode: string;
    scopeType: string;
    dateSubmitted: Date;
    authors: string[];
    authorEmail: string;
    editor: Types.ObjectId;
    affiliation: string;
    progressStatus: "In Progress" | "For Revision" | "Published" | "Rejected";
    reviewers: Types.ObjectId[];
    layoutArtistName: string;
    layoutArtistEmail: string;
    dateAccepted: Date;
    proofReaderName: string;
    proofReaderEmail: string;
    dateSent: Date;
    scope2: string;
    volumeYear: string;
    datePublished: Date;
    rejectReason: string;
    rejectDate: Date;
    comments: string;
    status: "Pre-Review" | "Double-Blind" | "Layouting" | "Final Proofreading" | "Published" | "Rejected";
    plagiarismScore: number;
    grammarScore: number;
}

const ManuscriptSchema = new Schema<ManuscriptDoc>(
    {
        fileCode: { type: String, unique: true, required: true },
        title: { type: String, required: true },
        scope: { type: String, required: true },
        scopeCode: { type: String, required: true },
        scopeType: { type: String, required: true },
        dateSubmitted: { type: Date, required: true },
        authors: { type: [String], required: true },
        authorEmail: { type: String, required: true },
        editor: { type: Schema.Types.ObjectId, ref: "Editor" },
        affiliation: { type: String, required: true },
        progressStatus: { type: String, enum: ManuscriptStatus, required: true, default: "In Progress" },
        reviewers: [{ type: Schema.Types.ObjectId, ref: "Reviewer" }],
        layoutArtistName: { type: String, default: null },
        layoutArtistEmail: { type: String, default: null },
        dateAccepted: { type: Date, default: null },
        proofReaderName: { type: String, default: null },
        proofReaderEmail: { type: String, default: null },
        dateSent: { type: Date, default: null },
        scope2: { type: String, default: null },
        volumeYear: { type: String, default: null },
        datePublished: { type: Date, default: null },
        rejectReason: { type: String, default: null },
        rejectDate: { type: Date, default: null },
        comments: { type: String, default: null },
        status: { type: String, default: "Pre-Review" },
        plagiarismScore: { type: Number, default: 0 },
        grammarScore: { type: Number, default: 0 }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

export default model<ManuscriptDoc>("Manuscript", ManuscriptSchema);
