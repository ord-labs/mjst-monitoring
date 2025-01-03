import Joi from "joi";

export const createEditorSchema = Joi.object({
    firstname: Joi.string().trim().required().label("Firstname"),
    middlename: Joi.string().trim().required().label("Middle"),
    lastname: Joi.string().trim().required().label("Lastname"),
    email: Joi.string().trim().required().label("Email"),
    position: Joi.string().trim().required().label("Position"),
    department: Joi.string().trim().required().label("Department"),
    profileLink: Joi.string().trim().optional().allow(null, "").label("Profile Link")
});

export const getEditorByIdSchema = Joi.object({
    editorId: Joi.string().trim().required()
});

export const updateEditorSchema = Joi.object({
    editorId: Joi.string().trim().required().label("editorId"),
    firstname: Joi.string().trim().required().label("Firstname"),
    middlename: Joi.string().trim().required().label("Middle"),
    lastname: Joi.string().trim().required().label("Lastname"),
    email: Joi.string().trim().required().label("Email"),
    position: Joi.string().trim().required().label("Position"),
    department: Joi.string().trim().required().label("Department"),
    profileLink: Joi.string().trim().label("Profile Link")
});

export const deleteEditorSchema = Joi.object({
    editorId: Joi.string().trim().required().label("editorId")
});
