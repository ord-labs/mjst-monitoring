import { Schema, model, Document, Types } from "mongoose";

export enum STATUS {
    IN_PROGRESS = "In Progress",
    FOR_REVISION = "For Revision",
    PUBLISHED = "Published",
    REJECTED = "Rejected"
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
    layoutStatus: "In Progress" | "For Revision" | "Completed";
    layoutFinishDate: Date;
    dateAccepted: Date;
    proofReaderName: string;
    proofReaderEmail: string;
    dateSent: Date;
    scope2: string;
    volumeYear: string;
    datePublished: Date;
    rejectReason: string;
    rejectComment: string;
    rejectDate: Date;
    revisionComment: string;
    revisionDate: Date;
    comments: string;
    status: "Pre-Review" | "Double-Blind" | "Layouting" | "Final Proofreading" | "Published" | "Rejected";
    plagiarismScore: number;
    grammarScore: number;
    issueNumber: string;
    issueName: string;
    volumeName: string;
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
        progressStatus: { type: String, enum: STATUS, required: true, default: "In Progress" },
        reviewers: [{ type: Schema.Types.ObjectId, ref: "Reviewer" }],
        layoutArtistName: { type: String, default: null },
        layoutArtistEmail: { type: String, default: null },
        layoutStatus: { type: String, required: true, default: "In Progress" },
        layoutFinishDate: { type: Date, default: null },
        dateAccepted: { type: Date, default: null },
        proofReaderName: { type: String, default: null },
        proofReaderEmail: { type: String, default: null },
        dateSent: { type: Date, default: null },
        scope2: { type: String, default: null },
        volumeYear: { type: String, default: null },
        datePublished: { type: Date, default: null },
        rejectReason: { type: String, default: null },
        rejectComment: { type: String, default: null },
        rejectDate: { type: Date, default: null },
        revisionComment: { type: String, default: null },
        revisionDate: { type: Date, default: null },
        comments: { type: String, default: null },
        status: { type: String, default: "Pre-Review" },
        plagiarismScore: { type: Number, default: 0 },
        grammarScore: { type: Number, default: 0 },
        issueNumber: { type: String, default: null },
        issueName: { type: String, default: null },
        volumeName: { type: String, default: null }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

export default model<ManuscriptDoc>("Manuscript", ManuscriptSchema);
