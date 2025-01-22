import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface EditorDoc extends Document {
    isValidPassword(password: string): boolean;
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    position: "Chief Editor" | "Assistant Editor" | "Director";
    department: string;
    profileLink: string;
    password: string;
}

const EditorSchema = new Schema<EditorDoc>(
    {
        firstname: { type: String, required: true },
        middlename: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true },
        position: { type: String, required: true },
        department: { type: String, required: true },
        profileLink: { type: String, default: null },
        password: { type: String, default: null }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

EditorSchema.pre("save", async function (next) {
    if (this.password) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

EditorSchema.methods.isValidPassword = async function (password: string) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
};

export default model<EditorDoc>("Editor", EditorSchema);
