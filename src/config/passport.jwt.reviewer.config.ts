import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import appConfig from "./app.config";
import Reviewer from "../components/reviewer/reviewer.model";
import { errorResponse } from "../utils/apiResponse";
import passport from "passport";

let opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: appConfig.APP_SECRET
};

const jwtPassportReviewerMiddleware = new JwtStrategy(opts, (jwtPayload, done) => {
    Reviewer.findOne({ _id: jwtPayload._id })
        .select("-password")
        .then((user: any) => {
            if (user && user.status) {
                return done(null, user);
            }
            return done(errorResponse(401, "Unauthorized request"));
        })
        .catch((err) => done(err));
});

export const authenticatedReviewer = passport.authenticate("jwt", { session: false });

export default jwtPassportReviewerMiddleware;
