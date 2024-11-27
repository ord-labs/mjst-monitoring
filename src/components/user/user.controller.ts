import { NextFunction, Request, Response } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import { createUserSchema, deleteUserSchema, loginUserByCredentialsSchema, updateUserSchema } from "./user.schema";
import { extractErrorMessage } from "../../utils/extractJoiError";
import bcrypt from "bcrypt";
import User from "./user.model";
import { generateToken } from "../../utils/jwtHelper";

/*
 * Extra Handlers
 */
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ _id: req.query.userId });

        if (user) {
            return jsonResponse(res, { status: 200, message: "User fetched successfully", data: user });
        }
        return next(errorResponse(400, "User not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        if (users) {
            return jsonResponse(res, { status: 200, message: "Users fetched successfully", data: users });
        }
        return next(errorResponse(400, "No users found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Get user by Id
 * @route GET /api/v1/user?userId=id
 * @params QUERY userId:string
 *
 * Get users
 * @route GET /api/v1/user
 */

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query;
    if (userId) {
        return getUserById(req, res, next);
    }

    return getUsers(req, res, next);
};

/*
 * Get user by bearer token
 * @route GET /api/v1/user/byToken
 */

export const getUserByToken = async (req: Request, res: Response, next: NextFunction) => {
    return jsonResponse(res, { status: 200, message: "User fetched successfully", data: { user: req.user } });
};

/*
 * Register or create new user global
 * @route POST /api/v1/user
 * @params BODY createUserSchema
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = createUserSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        // Check if email already exist
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return next(errorResponse(400, "Email already taken by another user"));
        }

        const newUser = await User.create(req.body);

        if (newUser) {
            const token: string = generateToken({ _id: newUser._id });
            return jsonResponse(res, {
                status: 201,
                message: "User created successfully",
                data: {
                    newUser,
                    token
                }
            });
        }
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Login user by email and password
 * @route POST /api/v1/user/login
 * @params BODY loginUserByCredentialsSchema
 */
export const loginUserByCredentials = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = loginUserByCredentialsSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (!user.status) return next(errorResponse(401, "Account was deactivated"));

            const validPassword = await user.isValidPassword(req.body.password);

            if (validPassword) {
                const token: string = generateToken({ _id: user._id });
                return jsonResponse(res, { status: 200, message: "Login successful", data: { token, user } });
            }

            return next(errorResponse(401, "Invalid email or password"));
        }

        return next(errorResponse(401, "Invalid email or password"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Update user
 * @route PUT /api/v1/user
 * @params updateUserSchema
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateUserSchema.validate({ ...req.body, userId: req.params.userId }, { abortEarly: false });
    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const id: string = req.params.userId;

        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        }

        const updatedUser = await User.findOneAndUpdate({ _id: id, status: true }, req.body, { new: true });

        if (updatedUser) {
            return jsonResponse(res, { status: 200, message: "User updated successfully", data: updatedUser });
        }

        return next(errorResponse(400, "User not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Delete/Soft Delete user
 * @route DELETE /api/v1/user
 * @params updateUserSchema
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = deleteUserSchema.validate({ ...req.body, userId: req.params.userId }, { abortEarly: false });
    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const id: string = req.params.userId;

        let deletedUser;

        if (req.body.isPermanent) {
            deletedUser = await User.findOneAndDelete({ _id: id });
        } else {
            deletedUser = await User.findOneAndUpdate({ _id: id }, { status: false }, { new: true });
        }

        if (deletedUser) {
            return jsonResponse(res, { status: 200, message: "User deleted successfully", data: deletedUser });
        }

        return next(errorResponse(400, "User not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};
