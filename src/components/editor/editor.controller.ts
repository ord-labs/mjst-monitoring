import { NextFunction, Request, Response } from "express";
import { errorResponse, jsonResponse } from "../../utils/apiResponse";
import { createEditorSchema, deleteEditorSchema } from "../editor/editor.schema";
import { extractErrorMessage } from "../../utils/extractJoiError";
import Editor from "./editor.model";
import { generateToken } from "../../utils/jwtHelper";
import { loginUserByCredentialsSchema } from "../user/user.schema";

/*
 * Extra Handlers
 */
const getEditorById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const editor = await Editor.findOne({ _id: req.query.editorId });

        if (editor) {
            return jsonResponse(res, { status: 200, message: "Editor fetched successfully", data: editor });
        }
        return next(errorResponse(400, "Editor not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

export const getEditors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const editors = await Editor.find();
        if (editors) {
            return jsonResponse(res, { status: 200, message: "Editors fetched successfully", data: editors });
        }
        return next(errorResponse(400, "No editors found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Get editor by Id
 * @route GET /api/v1/editor?editorId=id
 * @params QUERY editorId:string
 *
 * Get editors
 * @route GET /api/v1/editor
 */

export const getEditor = async (req: Request, res: Response, next: NextFunction) => {
    const { editorId } = req.query;
    if (editorId) {
        return getEditorById(req, res, next);
    }

    return getEditors(req, res, next);
};

/*
 * Create new editor
 * @route POST /api/v1/editor
 * @params BODY createEditorSchema
 */
export const createEditor = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = createEditorSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        // Check if email already exist
        const editorExists = await Editor.findOne({ email: req.body.email });
        if (editorExists) {
            return next(errorResponse(400, "Email already taken by another editor"));
        }

        const newEditor = await Editor.create(req.body);

        if (newEditor) {
            const token: string = generateToken({ _id: newEditor._id });
            return jsonResponse(res, {
                status: 201,
                message: "Editor created successfully",
                data: {
                    newEditor,
                    token
                }
            });
        }
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

export const loginEditorByCredentials = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = loginUserByCredentialsSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const editor = await Editor.findOne({ email: req.body.email });
        if (editor) {
            const validPassword = await editor.isValidPassword(req.body.password);

            if (validPassword) {
                const token: string = generateToken({ _id: editor._id });
                return jsonResponse(res, { status: 200, message: "Login successful", data: { token, editor } });
            }

            return next(errorResponse(401, "Invalid email or password"));
        }

        return next(errorResponse(401, "Invalid email or password"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Update editor
 * @route PUT /api/v1/editor
 * @params updateEditorSchema
 */
export const updateEditor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.editorId;

        const editor = await Editor.findOneAndUpdate({ _id: id }, req.body, { new: true });

        if (editor) {
            return jsonResponse(res, {
                status: 200,
                message: "Editor updated successfully",
                data: editor
            });
        }

        return next(errorResponse(400, "Editor not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};

/*
 * Delete/Soft Delete editor
 * @route DELETE /api/v1/editor
 * @params updateEditorSchema
 */
export const deleteEditor = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = deleteEditorSchema.validate(
        { ...req.body, editorId: req.params.editorId },
        { abortEarly: false }
    );
    if (error) {
        const errorMessages: string[] = extractErrorMessage(error);
        return next(errorResponse(400, "Invalid parameters", errorMessages));
    }

    try {
        const id: string = req.params.editorId;

        const deletedEditor = await Editor.findOneAndDelete({ _id: id });

        if (deletedEditor) {
            return jsonResponse(res, {
                status: 200,
                message: "Editor deleted successfully",
                data: deletedEditor
            });
        }

        return next(errorResponse(400, "Editor not found"));
    } catch (e) {
        return next(errorResponse(400, (e as Error).message));
    }
};
