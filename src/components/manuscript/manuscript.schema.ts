import Joi from "joi";

export const createManuscriptSchema = Joi.object({
    title: Joi.string().trim().required().label("Title"),
    fieldScope: Joi.string().trim().required().label("Field"),
    fieldScopeAbbr: Joi.string().trim().required().label("Field Abbreviation"),
    dateSubmitted: Joi.string().trim().required().label("Date Submitted"),
    authors: Joi.array().items(Joi.string()).required().label("Authors"),
    authorEmail: Joi.string()
        .email({ tlds: { allow: false } })
        .trim()
        .required()
        .label("Author Email"),
    editor: Joi.string().trim().required().label("Editor"),
    affiliation: Joi.string().trim().required().label("Field"),
    status: Joi.string().trim().label("Status"),
    layoutArtistName: Joi.string().trim().label("Layout Artist name"),
    layoutArtistEmail: Joi.string()
        .email({ tlds: { allow: false } })
        .trim()
        .label("Layout Artist Email"),
    dateAccepted: Joi.string().trim().label("Date Accepted"),
    proofReaderName: Joi.string().trim().label("Proof Reader Name"),
    proofReaderEmail: Joi.string()
        .email({ tlds: { allow: false } })
        .trim()
        .label("Proof Reader Email"),
    dateSent: Joi.string().trim().label("Date Sent"),
    scope: Joi.string().trim().label("Scope"),
    volumeYear: Joi.string().trim().label("Volume Year"),
    datePublished: Joi.string().trim().label("Date Published"),
    rejectReason: Joi.string().trim().label("Reject Reason"),
    rejectDate: Joi.string().trim().label("Reject Date"),
    comments: Joi.string().trim().label("Comments")
});

export const getManuscriptByIdSchema = Joi.object({
    manuscriptId: Joi.string().trim().required()
});

export const updateManuscriptSchema = Joi.object({
    manuscriptId: Joi.string().trim().required().label("manuscriptId"),
    title: Joi.string().trim().label("Title"),
    fieldScope: Joi.string().trim().label("Field"),
    fieldScopeAbbr: Joi.string().trim().label("Field Abbreviation"),
    dateSubmitted: Joi.string().trim().label("Date Submitted"),
    authors: Joi.array().items(Joi.string()).label("Authors"),
    authorEmail: Joi.string()
        .email({ tlds: { allow: false } })
        .trim()
        .label("Author Email"),
    editor: Joi.string().trim().label("Editor"),
    reviewers: Joi.array().items(Joi.string()).label("Reviewers"),
    affiliation: Joi.string().trim().label("Field"),
    status: Joi.string().trim().label("Status"),
    layoutArtistName: Joi.string().trim().label("Layout Artist name"),
    layoutArtistEmail: Joi.string()
        .email({ tlds: { allow: false } })
        .trim()
        .label("Layout Artist Email"),
    dateAccepted: Joi.string().trim().label("Date Accepted"),
    proofReaderName: Joi.string().trim().label("Proof Reader Name"),
    proofReaderEmail: Joi.string()
        .email({ tlds: { allow: false } })
        .trim()
        .label("Proof Reader Email"),
    dateSent: Joi.string().trim().label("Date Sent"),
    scope: Joi.string().trim().label("Scope"),
    volumeYear: Joi.string().trim().label("Volume Year"),
    datePublished: Joi.string().trim().label("Date Published"),
    rejectReason: Joi.string().trim().label("Reject Reason"),
    rejectDate: Joi.string().trim().label("Reject Date"),
    comments: Joi.string().trim().label("Comments")
});

export const deleteManuscriptSchema = Joi.object({
    manuscriptId: Joi.string().trim().required().label("manuscriptId")
});
