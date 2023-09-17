import * as UserService from '../services/user.service.js';
import { UserGET, UserPUT } from '../models/user/User.models.js';
import { MessageType } from '../enums/messageType.js';
import * as ProjectService from '../services/project.service.js';
import * as LikeService from '../services/like.service.js';
import * as UploadService from '../services/upload.service.js';
import { uploadDirectory } from '../configs/upload.config.js';
import { profilePictureDirectory } from '../configs/profilePicture.config.js';
import fs from 'fs/promises';

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

        res.status(200).json({ messageType: MessageType.Success, message: "Profile updated." });

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

        const getUserResult = await UserService.getById(req.userId);
        const getUserProjects = await ProjectService.getAllUserProjectsById(req.userId);

        for (const project of getUserProjects) {
            try {
                await fs.rm(uploadDirectory + project._id.toString(), { recursive: true });
            }
            catch (error) { }   

            const removeUploadsResult = await UploadService.removeAll(project._id.toString());
        }

        try {
            await fs.rm(profilePictureDirectory + getUserResult.ProfilePictureId + '.jpg');
        }
        catch (error) { }

        const removeUserResult = await UserService.remove(req.userId);
        const removeUserProjectsResult = await ProjectService.removeUserProjects(req.userId);
        const removeUserLikesResult = await LikeService.removeUserLikes(req.userId);

        return res.status(200).json({ messageType: MessageType.Success, message: "Account deleted." });


    } catch (error) {
        console.error("Error in user controller: remove:", error);
    }
}