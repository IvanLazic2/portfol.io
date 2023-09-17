import * as UserService from '../services/user.service.js';
import { UserGET, UserPUT } from '../models/user/User.model.js';
import { MessageType } from '../enums/messageType.js';

export async function get(req, res) {
    try {

        const getUserResult = await UserService.getByUsername(req.params.username);
        const user = UserGET.InstanceFromObject(getUserResult);

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);
    }
}

export async function getById(req, res) {
    try {

        const getUserResult = await UserService.getById(req.params.id);
        const user = UserGET.InstanceFromObject(getUserResult);

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);
    }
}

export async function update(req, res) {
    try {
        const getUserResult = await UserService.getById(req.userId);

        if (getUserResult.Username !== req.body.EditedUserUsername) {
            return res.status(400).json({ messageType: MessageType.Warning, message: "User edit not allowed." });
        }

        const user = UserPUT.InstanceFromObject(req.body);

        /*const errorMessage = user.Validate();
        if (errorMessage)
            return res.status(400).json({ messageType: MessageType.Warning, message: errorMessage });*/

        const updateUserResult = await UserService.update(req.userId, user);

        res.status(200).json({ messageType: MessageType.Success, message: "Account updated." });

    } catch (error) {
        console.error(error);
    }
}

export async function changeUsername(req, res) {
    try {

        const changeUsernameResult = await UserService.changeUsername(req.userId, req.body.Username);

        return res.status(200).json({ messageType: MessageType.Success, message: "Username changed." })

    } catch (error) {
        console.error(error);
    }
}

export async function changeEmail(req, res) {
    try {

        const changeEmailResult = await UserService.changeEmail(req.userId, req.body.Email);

        return res.status(200).json({ messageType: MessageType.Success, message: "Email changed." })

    } catch (error) {
        console.error(error);
    }
}

export async function usernameExists(req, res) {
    try {

        const usernameExistsResult = await UserService.getByUsername(req.params.username);

        return res.status(200).json(usernameExistsResult ? true : false);

    } catch (error) {
        console.error(error);
    }
}

export async function emailExists(req, res) {
    try {

        const emailExistsResult = await UserService.getByEmail(req.params.email);

        return res.status(200).json(emailExistsResult ? true : false);

    } catch (error) {
        console.error(error);
    }
}









export async function remove(req, res) {
    try {



    } catch (error) {
        console.error("Error in user controller: remove:", error);
    }
}