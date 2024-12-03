import Joi from "joi";

export const createReviewerSchema = Joi.object({
    firstname: Joi.string().trim().required().label("Firstname"),
    middlename: Joi.string().trim().required().label("Middle"),
    lastname: Joi.string().trim().required().label("Lastname"),
    email: Joi.string().trim().required().label("Email"),
    affiliation: Joi.string().trim().required().label("Affiliation"),
    fieldOfExpertise: Joi.string().trim().required().label("Field of Expertise"),
    publicationLink: Joi.string().trim().required().label("Publication Link")
});

export const getReviewerByIdSchema = Joi.object({
    reviewerId: Joi.string().trim().required()
});

export const updateReviewerSchema = Joi.object({
    reviewerId: Joi.string().trim().required().label("reviewerId"),
    firstname: Joi.string().trim().label("Firstname"),
    middlename: Joi.string().trim().label("Middle"),
    lastname: Joi.string().trim().label("Lastname"),
    email: Joi.string().trim().label("Email"),
    affiliation: Joi.string().trim().label("Affiliation"),
    fieldOfExpertise: Joi.string().trim().label("Field of Expertise"),
    publicationLink: Joi.string().trim().label("Publication Link")
});

export const deleteReviewerSchema = Joi.object({
    reviewerId: Joi.string().trim().required().label("reviewerId")
});
