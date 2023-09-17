import jwt from "jsonwebtoken";
import { MessageType } from '../enums/messageType.js';
import { RegisterPOST, LoginPOST } from '../models/auth/Auth.models.js';
import { randomBytesAsync, pbkdf2Async, secret } from '../configs/jwt.config.js';
import * as UserService from '../services/user.service.js';

async function generateToken(res, id, username, message) {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
    jwt.sign({ id, username, exp }, secret, (err, token) => {
        if (err)
            return res.status(500).json({ message: err });

        const user = { username, token };

        return res.status(200).json({ messageType: MessageType.Success, message, user });
    });
}

export async function register(req, res) {
    const registerPOST = new RegisterPOST(req.body.username, req.body.email, req.body.password);
    const errorMessage = registerPOST.Validate();
    if (errorMessage)
        return res.status(400).json({ messageType: MessageType.Warning, message: errorMessage });

    try {
        const salt = (await randomBytesAsync(16)).toString("hex");
        const hash = (await pbkdf2Async(registerPOST.Password, salt, 1000, 64, "sha512")).toString("hex");

        const registerResult = await UserService.register(registerPOST.Username, registerPOST.Email, salt, hash);
        generateToken(res, registerResult.insertedId.toString(), registerPOST.username, "Successfully registered.");
    } catch (error) {
        console.error(error);
        return res.status(400).json({ messageType: MessageType.Error, message: "Failed registering user." });
    }
}

export async function login(req, res) {
    const loginPOST = new LoginPOST(req.body.username, req.body.password);
    const errorMessage = loginPOST.Validate();
    if (errorMessage)
        return res.status(400).json({ messageType: MessageType.Warning, message: errorMessage });

    try {

        const getUserResult = await UserService.getByUsername(loginPOST.Username);

        if (!getUserResult)
            return res.status(400).json({ messageType: MessageType.Warning, message: "Wrong credentials." });

        const signinHash = (await pbkdf2Async(loginPOST.Password, getUserResult.Salt, 1000, 64, "sha512")).toString("hex");

        if (signinHash == getUserResult.Hash)
            generateToken(res, getUserResult._id.toString(), getUserResult.Username, "Successfully signed in.");
        else
            return res.status(401).json({ messageType: MessageType.Warning, message: "Wrong credentials." });

    } catch (error) {
        console.error(error);
        return res.status(400).json({ messageType: MessageType.Error, message: "Failed to login." });
    }
}