import Joi from "joi";

export const createUserSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email"),
    password: Joi.string().trim().required().label("Password"),
    role: Joi.number().required().label("Role")
});

export const loginUserByCredentialsSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email"),
    password: Joi.string().trim().required().label("Password")
});

export const getUserByIdSchema = Joi.object({
    userId: Joi.string().trim().required()
});

export const updateUserSchema = Joi.object({
    userId: Joi.string().trim().label("userId"),
    password: Joi.string().trim().label("Password"),
    role: Joi.number().label("Role")
});

export const deleteUserSchema = Joi.object({
    userId: Joi.string().trim().required().label("userId"),
    isPermanent: Joi.boolean().label("isPermanent")
});
