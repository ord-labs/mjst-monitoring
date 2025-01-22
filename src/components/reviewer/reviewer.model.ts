import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface ReviewerDoc extends Document {
    isValidPassword(password: string): boolean;
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    affiliation: string;
    fieldOfExpertise: string;
    publicationLink: string;
    password: string;
}

const ReviewerSchema = new Schema<ReviewerDoc>(
    {
        firstname: { type: String, required: true },
        middlename: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true },
        affiliation: { type: String, required: true },
        fieldOfExpertise: { type: String, required: true },
        publicationLink: { type: String, required: true },
        password: { type: String, required: true }
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

ReviewerSchema.pre("save", async function (next) {
    if (this.password) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

ReviewerSchema.methods.isValidPassword = async function (password: string) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
};

export default model<ReviewerDoc>("Reviewer", ReviewerSchema);
