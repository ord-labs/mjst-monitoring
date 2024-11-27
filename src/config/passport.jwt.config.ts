import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import User from "../components/user/user.model";
import appConfig from "./app.config";
import { errorResponse } from "../utils/apiResponse";
import passport from "passport";

let opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: appConfig.APP_SECRET
};

const jwtPassportMiddleware = new JwtStrategy(opts, (jwtPayload, done) => {
    User.findOne({ _id: jwtPayload._id })
        .select("-password")
        .then((user: any) => {
            if (user && user.status) {
                return done(null, user);
            }
            return done(errorResponse(401, "Unauthorized request"));
        })
        .catch((err) => done(err));
});

export const authenticated = passport.authenticate("jwt", { session: false });

export default jwtPassportMiddleware;
