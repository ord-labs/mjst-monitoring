import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import appConfig from "./app.config";
import Editor from "../components/editor/editor.model";
import { errorResponse } from "../utils/apiResponse";
import passport from "passport";

let opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: appConfig.APP_SECRET
};

const jwtPassportEditorMiddleware = new JwtStrategy(opts, (jwtPayload, done) => {
    Editor.findOne({ _id: jwtPayload._id })
        .select("-password")
        .then((user: any) => {
            if (user && user.status) {
                return done(null, user);
            }
            return done(errorResponse(401, "Unauthorized request"));
        })
        .catch((err) => done(err));
});

export const authenticatedEditor = passport.authenticate("jwt", { session: false });

export default jwtPassportEditorMiddleware;
