import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
    DIRECTOR,
    STAFF
}

export interface UserDoc extends Document {
    isValidPassword(password: string): boolean;
    email: string;
    password: string;
    role: UserRole;
    status: boolean;
}

const UserSchema = new Schema<UserDoc>(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, default: "" },
        role: { type: Number, enum: UserRole, default: UserRole.DIRECTOR },
        status: { type: Boolean, default: true }
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

UserSchema.pre("save", async function (next) {
    if (this.password) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

UserSchema.methods.isValidPassword = async function (password: string) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
};

export default model<UserDoc>("User", UserSchema);
