import { Schema, model, Document, Types } from "mongoose";

export enum ManuscriptStatus {
    IN_PROGRESS = "in progress",
    FOR_REVISION = "for revision",
    PUBLISHED = "published"
}

export interface ManuscriptDoc extends Document {
    fileCode: string;
    title: string;
    fieldScope: string;
    fieldScopeAbbr: string;
    dateSubmitted: Date;
    authors: string[];
    authorEmail: string;
    editor: Types.ObjectId;
    affiliation: string;
    status: "in progress" | "for revision" | "published";
    reviewers: Types.ObjectId[];
    layoutArtistName: string;
    layoutArtistEmail: string;
    dateAccepted: Date;
    proofReaderName: string;
    proofReaderEmail: string;
    dateSent: Date;
    scope: string;
    volumeYear: string;
    datePublished: Date;
    rejectReason: string;
    rejectDate: Date;
    comments: string;
}

const ManuscriptSchema = new Schema<ManuscriptDoc>(
    {
        fileCode: { type: String, unique: true, required: true },
        title: { type: String, required: true },
        fieldScope: { type: String, required: true },
        fieldScopeAbbr: { type: String, required: true },
        dateSubmitted: { type: Date, required: true },
        authors: { type: [String], required: true },
        authorEmail: { type: String, required: true },
        editor: { type: Schema.Types.ObjectId, ref: "Editor" },
        affiliation: { type: String, required: true },
        status: { type: String, enum: ManuscriptStatus, required: true },
        reviewers: [{ type: Schema.Types.ObjectId, ref: "Reviewer" }],
        layoutArtistName: { type: String },
        layoutArtistEmail: { type: String },
        dateAccepted: { type: Date },
        proofReaderName: { type: String },
        proofReaderEmail: { type: String },
        dateSent: { type: Date },
        scope: { type: String },
        volumeYear: { type: String },
        datePublished: { type: Date },
        rejectReason: { type: String },
        rejectDate: { type: Date },
        comments: { type: String }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        },
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        }
    }
);

export default model<ManuscriptDoc>("Manuscript", ManuscriptSchema);
