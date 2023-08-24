import jwt from "jsonwebtoken";
import { secret } from "../configs/jwt.config.js";

export const jwtProtection = (req, res, next) => {
    try {
        const token = req.headers["authorization"];

        jwt.verify(token, secret, (err, decodedToken) => {
            if (err)
                console.log(token);

            req.id = decodedToken.id;
            req.userId = decodedToken.id;

            return;
        });

        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Unauthenticated." });
    }
}