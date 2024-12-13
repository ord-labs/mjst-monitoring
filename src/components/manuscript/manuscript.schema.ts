import Joi from "joi";

// export const createManuscriptSchema = Joi.object({
//     title: Joi.string().trim().required().label("Title"),
//     fieldScope: Joi.string().trim().required().label("Field"),
//     fieldScopeAbbr: Joi.string().trim().required().label("Field Abbreviation"),
//     dateSubmitted: Joi.string().trim().required().label("Date Submitted"),
//     authors: Joi.array().items(Joi.string()).required().label("Authors"),
//     authorEmail: Joi.string()
//         .email({ tlds: { allow: false } })
//         .trim()
//         .required()
//         .label("Author Email"),
//     editor: Joi.string().trim().required().label("Editor"),
//     affiliation: Joi.string().trim().required().label("Field"),
//     status: Joi.string().trim().optional().label("Status"),
//     layoutArtistName: Joi.string().trim().optional().label("Layout Artist name"),
//     layoutArtistEmail: Joi.string()
//         .email({ tlds: { allow: false } })
//         .trim()
//         .optional()
//         .label("Layout Artist Email"),
//     dateAccepted: Joi.string().trim().optional().label("Date Accepted"),
//     proofReaderName: Joi.string().trim().optional().label("Proof Reader Name"),
//     proofReaderEmail: Joi.string()
//         .email({ tlds: { allow: false } })
//         .trim()
//         .optional()
//         .label("Proof Reader Email"),
//     dateSent: Joi.string().trim().optional().label("Date Sent"),
//     scope: Joi.string().trim().optional().label("Scope"),
//     volumeYear: Joi.string().trim().optional().label("Volume Year"),
//     datePublished: Joi.string().trim().optional().label("Date Published"),
//     rejectReason: Joi.string().trim().optional().label("Reject Reason"),
//     rejectDate: Joi.string().trim().optional().label("Reject Date"),
//     comments: Joi.string().trim().optional().label("Comments"),
//     stepStatus: Joi.string().trim().optional().label("Step Status")
// });

export const getManuscriptByIdSchema = Joi.object({
    manuscriptId: Joi.string().trim().required()
});

// export const updateManuscriptSchema = Joi.object({
//     manuscriptId: Joi.string().trim().required().label("manuscriptId"),
//     title: Joi.string().trim().optional().label("Title"),
//     fieldScope: Joi.string().trim().optional().label("Field"),
//     fieldScopeAbbr: Joi.string().trim().optional().label("Field Abbreviation"),
//     dateSubmitted: Joi.string().trim().optional().label("Date Submitted"),
//     authors: Joi.array().items(Joi.string()).optional().label("Authors"),
//     authorEmail: Joi.string()
//         .email({ tlds: { allow: false } })
//         .trim()
//         .optional()
//         .label("Author Email"),
//     editor: Joi.string().trim().optional().label("Editor"),
//     reviewers: Joi.array().items(Joi.string()).optional().label("Reviewers"),
//     affiliation: Joi.string().trim().optional().label("Field"),
//     status: Joi.string().trim().optional().label("Status"),
//     layoutArtistName: Joi.string().trim().optional().label("Layout Artist name"),
//     layoutArtistEmail: Joi.string()
//         .email({ tlds: { allow: false } })
//         .trim()
//         .optional()
//         .label("Layout Artist Email"),
//     dateAccepted: Joi.string().trim().optional().label("Date Accepted"),
//     proofReaderName: Joi.string().trim().optional().label("Proof Reader Name"),
//     proofReaderEmail: Joi.string()
//         .email({ tlds: { allow: false } })
//         .trim()
//         .optional()
//         .label("Proof Reader Email"),
//     dateSent: Joi.string().trim().optional().label("Date Sent"),
//     scope: Joi.string().trim().optional().label("Scope"),
//     volumeYear: Joi.string().trim().optional().label("Volume Year"),
//     datePublished: Joi.string().trim().optional().label("Date Published"),
//     rejectReason: Joi.string().trim().optional().label("Reject Reason"),
//     rejectDate: Joi.string().trim().optional().label("Reject Date"),
//     comments: Joi.string().trim().optional().label("Comments"),
//     stepStatus: Joi.string().trim().optional().label("Step Status")
// });

export const deleteManuscriptSchema = Joi.object({
    manuscriptId: Joi.string().trim().required().label("manuscriptId")
});
